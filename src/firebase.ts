/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { 
  initializeAuth,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  getAuth,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut, 
  User, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore,
  initializeFirestore, 
  doc, 
  getDoc,
  collection,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  orderBy
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize services with experimental long-polling to prevent connection errors inside restricted iframes
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn("initializeFirestore with settings failed, falling back to standard getFirestore:", e);
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}
export const db = firestoreDb; /* CRITICAL */

let authInstance: any;
try {
  // Try to get existing Auth instance if already initialized to avoid "already-initialized" errors
  authInstance = getAuth(app);
} catch (e) {
  try {
    let isIndexedDBSupported = false;
    try {
      if (typeof window !== "undefined" && window.indexedDB) {
        isIndexedDBSupported = true;
      }
    } catch (err) {
      isIndexedDBSupported = false;
    }

    let isLocalStorageSupported = false;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("__firebase_test__", "1");
        window.localStorage.removeItem("__firebase_test__");
        isLocalStorageSupported = true;
      }
    } catch (err) {
      isLocalStorageSupported = false;
    }

    let isSessionStorageSupported = false;
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem("__firebase_test__", "1");
        window.sessionStorage.removeItem("__firebase_test__");
        isSessionStorageSupported = true;
      }
    } catch (err) {
      isSessionStorageSupported = false;
    }

    const persistences = [];
    if (isIndexedDBSupported) {
      persistences.push(indexedDBLocalPersistence);
    }
    if (isLocalStorageSupported) {
      persistences.push(browserLocalPersistence);
    }
    if (isSessionStorageSupported) {
      persistences.push(browserSessionPersistence);
    }

    if (persistences.length === 0) {
      persistences.push(inMemoryPersistence);
    }

    authInstance = initializeAuth(app, {
      persistence: persistences
    });
  } catch (errInit) {
    console.warn("Failed to initializeAuth carefully, falling back to simple getAuth:", errInit);
    authInstance = getAuth(app);
  }
}
export const auth = authInstance;

// Authentication Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

// Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    const isPopupClosed = error?.code === "auth/popup-closed-by-user" || 
                          String(error?.message || "").includes("popup-closed-by-user") ||
                          String(error || "").includes("popup-closed-by-user");
    if (isPopupClosed) {
      console.warn("Google Login Popup closed by user or blocked by iframe environment:", error);
    } else {
      console.error("Google Login Error:", error);
    }
    throw error;
  }
}

export async function loginAnonymously(): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error("Anonymous Sign-In Error:", error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
}

// Ensure first-connection connection test (from firebase-integration skill)
async function testConnection() {
  try {
    await getDoc(doc(db, "test", "connection"));
  } catch (error) {
    console.warn("Firebase test connection warning:", error);
  }
}
// Commented out automatic call to avoid unsolicited network requests on load inside iframe
// testConnection();

// FIRESTORE OPERATIONS ERROR WRAPPER (from firebase-integration skill)
enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- DATABASE HANDLERS ---

// 1. Bookmarks/Favorites

export interface FirestoreFavorite {
  id?: string;
  userId: string;
  type: "scripture" | "character";
  itemKey: string;
  portion?: string;
  title: string;
  savedAt: any;
  religion?: string;
}

export async function addFavorite(
  type: "scripture" | "character",
  itemKey: string,
  title: string,
  portion: string = "",
  religion: string = ""
): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to save bookmarks.");
  }

  const path = "favorites";
  try {
    const key = doc(collection(db, path)).id;
    const favData: FirestoreFavorite = {
      userId: user.uid,
      type,
      itemKey,
      title,
      savedAt: serverTimestamp(),
    };
    if (portion) {
      favData.portion = portion;
    }
    if (religion) {
      favData.religion = religion;
    }

    await setDoc(doc(db, path, key), favData);
    return key;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return "";
  }
}

export async function removeFavorite(favId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `favorites/${favId}`;
  try {
    await deleteDoc(doc(db, "favorites", favId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateFavorite(favId: string, newTitle: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `favorites/${favId}`;
  try {
    const docRef = doc(db, "favorites", favId);
    await updateDoc(docRef, {
      title: newTitle
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function getFavorites(): Promise<FirestoreFavorite[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const path = "favorites";
  try {
    const q = query(
      collection(db, path),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const favorites: FirestoreFavorite[] = [];
    snapshot.forEach((docSnap) => {
      favorites.push({
        id: docSnap.id,
        ...docSnap.data()
      } as FirestoreFavorite);
    });
    return favorites;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// 2. Personal Journal/Study Notes

export interface FirestoreNote {
  id?: string;
  userId: string;
  itemKey: string;
  portion?: string;
  title: string;
  content: string;
  createdAt: any;
  updatedAt: any;
}

export async function createNote(
  itemKey: string,
  title: string,
  content: string,
  portion: string = ""
): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to create notes.");
  }

  const path = "notes";
  try {
    const noteId = doc(collection(db, path)).id;
    const noteData: FirestoreNote = {
      userId: user.uid,
      itemKey,
      title,
      content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    if (portion) {
      noteData.portion = portion;
    }

    await setDoc(doc(db, path, noteId), noteData);
    return noteId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return "";
  }
}

export async function updateNoteInFirestore(
  noteId: string,
  title: string,
  content: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `notes/${noteId}`;
  try {
    const docRef = doc(db, "notes", noteId);
    await updateDoc(docRef, {
      title,
      content,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteNoteFromFirestore(noteId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `notes/${noteId}`;
  try {
    await deleteDoc(doc(db, "notes", noteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getNotesFromFirestore(): Promise<FirestoreNote[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const path = "notes";
  try {
    const q = query(
      collection(db, path),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const notesList: FirestoreNote[] = [];
    snapshot.forEach((docSnap) => {
      notesList.push({
        id: docSnap.id,
        ...docSnap.data()
      } as FirestoreNote);
    });
    return notesList;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// 3. Portion/Verse-level Threaded Comments

export interface FirestoreComment {
  id?: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  verseRef: string;
  content: string;
  isPrivate: boolean;
  parentId: string | null;
  createdAt: any;
}

export async function addComment(
  verseRef: string,
  content: string,
  isPrivate: boolean,
  parentId: string | null = null
): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to participate in the discussions.");
  }

  const path = "comments";
  try {
    const commentId = doc(collection(db, path)).id;
    const commentData: FirestoreComment = {
      userId: user.uid,
      userName: user.displayName || user.email || "Anonymous Seeker",
      userPhoto: user.photoURL || undefined,
      verseRef,
      content,
      isPrivate,
      parentId,
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, path, commentId), commentData);
    return commentId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return "";
  }
}

export async function updateCommentInFirestore(
  commentId: string,
  content: string,
  isPrivate: boolean
): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `comments/${commentId}`;
  try {
    const docRef = doc(db, "comments", commentId);
    await updateDoc(docRef, {
      content,
      isPrivate
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCommentFromFirestore(commentId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `comments/${commentId}`;
  try {
    await deleteDoc(doc(db, "comments", commentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getCommentsForVerse(verseRef: string): Promise<FirestoreComment[]> {
  const user = auth.currentUser;
  const path = "comments";
  
  try {
    // 1. Fetch public comments for this verse
    const publicQ = query(
      collection(db, path),
      where("verseRef", "==", verseRef),
      where("isPrivate", "==", false)
    );
    const publicSnapshot = await getDocs(publicQ);
    const commentsList: FirestoreComment[] = [];
    
    publicSnapshot.forEach((docSnap) => {
      commentsList.push({
        id: docSnap.id,
        ...docSnap.data()
      } as FirestoreComment);
    });

    // 2. Fetch private comments of the current user if logged in
    if (user) {
      const privateQ = query(
        collection(db, path),
        where("verseRef", "==", verseRef),
        where("isPrivate", "==", true),
        where("userId", "==", user.uid)
      );
      const privateSnapshot = await getDocs(privateQ);
      privateSnapshot.forEach((docSnap) => {
        commentsList.push({
          id: docSnap.id,
          ...docSnap.data()
        } as FirestoreComment);
      });
    }

    // Sort by createdAt in memory to avoid dynamic composite query indexing errors
    commentsList.sort((a, b) => {
      const aTime = a.createdAt?.seconds || a.createdAt?.toMillis?.() || (typeof a.createdAt === "string" ? new Date(a.createdAt).getTime() : 0);
      const bTime = b.createdAt?.seconds || b.createdAt?.toMillis?.() || (typeof b.createdAt === "string" ? new Date(b.createdAt).getTime() : 0);
      return aTime - bTime;
    });

    return commentsList;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// 4. Custom thematic folders (Collections) & Collection Verses

export interface FirestoreCollection {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: any;
}

export interface FirestoreCollectionVerse {
  id?: string;
  collectionId: string;
  userId: string;
  bookKey: string;
  bookTitle: string;
  religion: string;
  divisionNum: number;
  divisionName: string;
  verseNumber: string | number;
  translation: string;
  originalText?: string;
  savedAt: any;
}

export async function createCollection(name: string, description: string = ""): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to create custom collections.");
  }

  const path = "collections";
  try {
    const colId = doc(collection(db, path)).id;
    const colData: FirestoreCollection = {
      userId: user.uid,
      name,
      description,
      createdAt: serverTimestamp()
    };
    await setDoc(doc(db, path, colId), colData);
    return colId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return "";
  }
}

export async function deleteCollectionFromFirestore(collectionId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `collections/${collectionId}`;
  try {
    // 1. Delete collection document
    await deleteDoc(doc(db, "collections", collectionId));
    
    // 2. Also delete all items within this collection
    const itemsPath = "collection_verses";
    const q = query(
      collection(db, itemsPath),
      where("collectionId", "==", collectionId)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, itemsPath, docSnap.id));
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getCollectionsFromFirestore(): Promise<FirestoreCollection[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const path = "collections";
  try {
    const q = query(
      collection(db, path),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const list: FirestoreCollection[] = [];
    snapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as FirestoreCollection);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function addVerseToCollectionFirestore(
  collectionId: string,
  verse: Omit<FirestoreCollectionVerse, "userId" | "savedAt">
): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to save verses to your collections.");
  }

  const path = "collection_verses";
  try {
    const itemId = doc(collection(db, path)).id;
    const itemData: FirestoreCollectionVerse = {
      ...verse,
      userId: user.uid,
      savedAt: serverTimestamp()
    };
    await setDoc(doc(db, path, itemId), itemData);
    return itemId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return "";
  }
}

export async function removeVerseFromCollectionFirestore(itemId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `collection_verses/${itemId}`;
  try {
    await deleteDoc(doc(db, "collection_verses", itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getCollectionVersesFirestore(): Promise<FirestoreCollectionVerse[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const path = "collection_verses";
  try {
    const q = query(
      collection(db, path),
      where("userId", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    const list: FirestoreCollectionVerse[] = [];
    snapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as FirestoreCollectionVerse);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// 5. Custom Overridden Images
export interface FirestoreUserCustomImage {
  id?: string;
  userId: string;
  itemKey: string;
  type: "scripture" | "character";
  imageUrl: string;
  updatedAt: any;
}

/**
 * Saves or updates a custom overridden image for a scripture book / character.
 * Uses an idempotent, predictable document ID to prevent duplication.
 */
export async function saveUserCustomImage(
  itemKey: string,
  type: "scripture" | "character",
  imageUrl: string,
  skipAuditLog = false
): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to sync custom images with the cloud.");
  }

  const path = "user_custom_images";
  try {
    const docId = `${user.uid}_${itemKey}`;
    const data: FirestoreUserCustomImage = {
      userId: user.uid,
      itemKey,
      type,
      imageUrl,
      updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, path, docId), data);

    if (!skipAuditLog) {
      await createAdminAuditLog(
        "UPDATE_IMAGE",
        `Updated image for ${type} '${itemKey}' to URL: ${imageUrl}`
      );
    }

    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return "";
  }
}

/**
 * Reverts a custom overridden image, deleting it from Firestore.
 */
export async function deleteUserCustomImage(itemKey: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const path = `user_custom_images/${user.uid}_${itemKey}`;
  try {
    await deleteDoc(doc(db, "user_custom_images", `${user.uid}_${itemKey}`));

    await createAdminAuditLog(
      "RESET_IMAGE",
      `Reset custom image for '${itemKey}' back to system default.`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Fetches all custom overridden images (globally configured by the administrator).
 */
export async function getUserCustomImages(): Promise<FirestoreUserCustomImage[]> {
  const path = "user_custom_images";
  try {
    const snapshot = await getDocs(collection(db, path));
    const list: FirestoreUserCustomImage[] = [];
    snapshot.forEach((docSnap) => {
      list.push({
        id: docSnap.id,
        ...docSnap.data()
      } as FirestoreUserCustomImage);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

/**
 * Saves the gallery lock setting to Firestore. Only the administrator can perform this action.
 */
export async function saveGalleryLockSetting(isLocked: boolean): Promise<void> {
  const user = auth.currentUser;
  if (!user || user.email !== "adarshshuklagarg@gmail.com") {
    throw new Error("Unauthorized: Only the administrator can modify security settings.");
  }

  const path = "system_settings/gallery";
  try {
    await setDoc(doc(db, "system_settings", "gallery"), {
      isLocked,
      updatedBy: user.uid,
      updatedAt: serverTimestamp()
    });

    // Write administrative audit log
    await createAdminAuditLog(
      "TOGGLE_LOCK",
      `Gallery was ${isLocked ? "LOCKED" : "UNLOCKED"} for general users.`
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetches the gallery lock setting from Firestore.
 */
export async function getGalleryLockSetting(): Promise<boolean> {
  const path = "system_settings/gallery";
  try {
    const docSnap = await getDoc(doc(db, "system_settings", "gallery"));
    if (docSnap.exists()) {
      return !!docSnap.data().isLocked;
    }
    return false; // Default is unlocked
  } catch (error) {
    console.warn("Failed to fetch gallery lock setting:", error);
    return false;
  }
}

// 6. Administrative Audit Logs Settings
export interface AdminAuditLog {
  id: string;
  action: string;
  details: string;
  userEmail: string;
  userId: string;
  timestamp: any;
}

/**
 * Creates an administrative audit log entry in Firestore.
 */
export async function createAdminAuditLog(action: string, details: string): Promise<void> {
  const user = auth.currentUser;
  if (!user || user.email !== "adarshshuklagarg@gmail.com") {
    return; // Silent bypass if not admin or not logged in
  }
  const path = "admin_audit_logs";
  try {
    const logId = doc(collection(db, path)).id;
    await setDoc(doc(db, path, logId), {
      action,
      details,
      userEmail: user.email || "",
      userId: user.uid,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to write administrative audit log:", error);
  }
}

/**
 * Retrieves administrative audit logs ordered by timestamp descending.
 */
export async function getAdminAuditLogs(): Promise<AdminAuditLog[]> {
  const user = auth.currentUser;
  if (!user || user.email !== "adarshshuklagarg@gmail.com") {
    return [];
  }
  const path = "admin_audit_logs";
  try {
    const q = query(
      collection(db, path),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);
    const logs: AdminAuditLog[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      logs.push({
        id: docSnap.id,
        action: data.action || "",
        details: data.details || "",
        userEmail: data.userEmail || "",
        userId: data.userId || "",
        timestamp: data.timestamp
      });
    });
    return logs;
  } catch (error) {
    console.error("Failed to fetch administrative audit logs:", error);
    return [];
  }
}

/**
 * Migrates all user bookmarks, notes, comments, collections, and custom images
 * from the old database ID to the new active database ID.
 * Since the user is authenticated, the client-side session is fully authorized
 * to read from the old DB and write to the new DB.
 */
export async function migrateDataToNewDatabase(
  sourceDatabaseId: string,
  statusCallback: (status: string) => void
): Promise<number> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to migrate your study data.");
  }

  const dbIdToUse = sourceDatabaseId.trim() === "(default)" || sourceDatabaseId.trim() === "" 
    ? "" 
    : sourceDatabaseId.trim();

  statusCallback(`🔌 Connecting to the legacy database ID: '${dbIdToUse || "(default)"}'...`);
  // Initialize a separate named app to avoid conflicts with the primary app's Firestore instance
  const sourceAppName = `migration-source-${Date.now()}`;
  const oldApp = initializeApp(firebaseConfig, sourceAppName);
  
  const oldDb = dbIdToUse 
    ? initializeFirestore(oldApp, { experimentalForceLongPolling: true }, dbIdToUse)
    : initializeFirestore(oldApp, { experimentalForceLongPolling: true });
  
  const newDb = db; // points to interfaith-108

  const COLLECTIONS = [
    "favorites",
    "notes",
    "comments",
    "collections",
    "collection_verses",
    "user_custom_images",
    "system_settings"
  ];

  let totalMigrated = 0;

  // 1. Migrate parent 'scriptures' and their subcollection 'verses'
  statusCallback("📂 Scanning parent 'scriptures' collection...");
  try {
    const oldScripturesSnap = await getDocs(collection(oldDb, "scriptures"));
    if (!oldScripturesSnap.empty) {
      statusCallback(`🔄 Found ${oldScripturesSnap.size} books in 'scriptures'. Migrating parent documents and subcollections...`);
      for (const scriptureDoc of oldScripturesSnap.docs) {
        const bookId = scriptureDoc.id;
        const bookData = scriptureDoc.data();
        
        await setDoc(doc(newDb, "scriptures", bookId), bookData);
        totalMigrated++;
        
        // Query subcollection 'verses'
        const oldVersesSnap = await getDocs(collection(oldDb, "scriptures", bookId, "verses"));
        if (!oldVersesSnap.empty) {
          statusCallback(`  🔄 Migrating ${oldVersesSnap.size} verses for book '${bookId}'...`);
          let verseCount = 0;
          for (const verseDoc of oldVersesSnap.docs) {
            await setDoc(doc(newDb, "scriptures", bookId, "verses", verseDoc.id), verseDoc.data());
            verseCount++;
            totalMigrated++;
          }
          statusCallback(`  ✓ Successfully migrated ${verseCount} subcollection verses for '${bookId}'.`);
        }
      }
    } else {
      statusCallback("✓ Parent 'scriptures' collection is empty in legacy database.");
    }
  } catch (err: any) {
    console.error("Error migrating scriptures and verses:", err);
    statusCallback(`⚠️ Error migrating 'scriptures': ${err.message || err}`);
  }

  // 2. Migrate flat 'verses' collection
  statusCallback("📂 Scanning flat 'verses' collection...");
  try {
    const oldVersesSnap = await getDocs(collection(oldDb, "verses"));
    if (!oldVersesSnap.empty) {
      statusCallback(`🔄 Found ${oldVersesSnap.size} flat verses in 'verses'. Migrating...`);
      let verseCount = 0;
      for (const verseDoc of oldVersesSnap.docs) {
        await setDoc(doc(newDb, "verses", verseDoc.id), verseDoc.data());
        verseCount++;
        totalMigrated++;
        if (verseCount % 20 === 0 || verseCount === oldVersesSnap.size) {
          statusCallback(`  ⚡ Progress for 'verses': ${verseCount}/${oldVersesSnap.size} migrated...`);
        }
      }
      statusCallback(`✓ Successfully migrated ${verseCount} flat verses.`);
    } else {
      statusCallback("✓ Flat 'verses' collection is empty in legacy database.");
    }
  } catch (err: any) {
    console.error("Error migrating flat verses:", err);
    statusCallback(`⚠️ Error migrating 'verses': ${err.message || err}`);
  }

  // 3. Migrate standard collections
  for (const colName of COLLECTIONS) {
    statusCallback(`📂 Scanning collection: '${colName}'...`);
    try {
      let oldSnapshot;
      if (["favorites", "notes", "collections", "collection_verses"].includes(colName)) {
        const q = query(collection(oldDb, colName), where("userId", "==", user.uid));
        oldSnapshot = await getDocs(q);
      } else {
        oldSnapshot = await getDocs(collection(oldDb, colName));
      }

      if (oldSnapshot.empty) {
        statusCallback(`✓ Collection '${colName}' is empty.`);
        continue;
      }

      statusCallback(`🔄 Migrating ${oldSnapshot.size} documents in '${colName}'...`);
      let count = 0;
      for (const docSnap of oldSnapshot.docs) {
        const data = docSnap.data();
        await setDoc(doc(newDb, colName, docSnap.id), data);
        count++;
        totalMigrated++;
        
        if (count % 10 === 0 || count === oldSnapshot.size) {
          statusCallback(`⚡ Progress for '${colName}': ${count}/${oldSnapshot.size} migrated...`);
        }
      }
      statusCallback(`✓ Successfully migrated ${count} documents for '${colName}'.`);
    } catch (err: any) {
      console.error(`Error migrating '${colName}':`, err);
      statusCallback(`⚠️ Error migrating '${colName}': ${err.message || err}`);
    }
  }

  statusCallback(`🎉 Migration completed! Successfully moved ${totalMigrated} items to 'interfaith-108'.`);
  return totalMigrated;
}

export async function fetchYajurvedaBranchNames(): Promise<{ shukla: string; krishna: string }> {
  let shukla = "Shukla (White)";
  let krishna = "Krishna (Black)";
  try {
    const shuklaRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "shukla");
    const shuklaSnap = await getDoc(shuklaRef);
    if (shuklaSnap.exists() && shuklaSnap.data()?.branch_name) {
      shukla = String(shuklaSnap.data().branch_name);
    }

    const krishnaRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna");
    const krishnaSnap = await getDoc(krishnaRef);
    if (krishnaSnap.exists() && krishnaSnap.data()?.branch_name) {
      krishna = String(krishnaSnap.data().branch_name);
    }
  } catch (e) {
    console.warn("[Firestore] Error fetching Yajurveda branch names:", e);
  }
  return { shukla, krishna };
}

/**
 * Dynamic Firestore Scripture Loader
 * Checks if the user uploaded canonical scriptures (like Bhagavad Gita or Rigveda)
 * into their Firestore database under 'scriptures/{bookKey}/verses' or 'verses'.
 * If found, displays them instead of calling the Gemini generator.
 */
export async function fetchScriptureFromFirestore(
  bookKey: string,
  divisionNumber: number,
  options?: any
): Promise<any | null> {
  try {
    const k = bookKey.toLowerCase();
    const div = Number(divisionNumber);
    
    // Check custom "Holy Scripture Books" collection first
    console.log(`[Firestore Scripture Loader] Checking custom 'Holy Scripture Books' for bookKey: '${bookKey}'...`);
    
    // Check if we are loading Bhagavad Gita and search the specific path:
    // Holy Scripture Books -> Hinduism -> Bhagavad Gita -> [chapterDoc] -> verses
    if (k === "bhagavad_gita") {
      try {
        let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Bhagavad Gita");
        let snap;
        try {
          const q = query(directColRef, orderBy("chapter_number", "asc"));
          snap = await getDocs(q);
        } catch (queryChErr) {
          console.warn("[Firestore Scripture Loader] Failed direct chapter query with orderBy, trying unordered:", queryChErr);
          snap = await getDocs(directColRef);
        }
        
        if (snap.empty) {
          console.log("[Firestore Scripture Loader] Subcollection 'Bhagavad Gita' empty or not found. Falling back to 'Bhagavad Gita (श्रीमद्भगवद्गीता)'...");
          directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Bhagavad Gita (श्रीमद्भगवद्गीता)");
          try {
            const q = query(directColRef, orderBy("chapter_number", "asc"));
            snap = await getDocs(q);
          } catch (queryChErr) {
            console.warn("[Firestore Scripture Loader] Failed fallback chapter query with orderBy, trying unordered:", queryChErr);
            snap = await getDocs(directColRef);
          }
        }
        
        if (!snap.empty) {
          const match = snap.docs.find((docSnap) => {
            const data = docSnap.data();
            const chNum = data.chapter_number ?? data.chapterNumber ?? data.chapter ?? data.number ?? docSnap.id;
            return Number(chNum) === div;
          });
          
          if (match) {
            const versesCol = collection(match.ref, "verses");
            let versesSnap;
            try {
              const q = query(versesCol, orderBy("verse_number", "asc"));
              versesSnap = await getDocs(q);
            } catch (queryVerr) {
              console.warn("[Firestore Scripture Loader] Failed direct verses query with orderBy, trying unordered:", queryVerr);
              versesSnap = await getDocs(versesCol);
            }
            if (!versesSnap.empty) {
              console.log(`[Firestore Scripture Loader] Hit: Found ${versesSnap.size} verses for Bhagavad Gita chapter ${div} in direct path: 'Holy Scripture Books' -> 'Hinduism' -> 'Bhagavad Gita'`);
              return formatFirestoreVerses(versesSnap.docs, div, bookKey);
            }
          }
        }
      } catch (e) {
        console.warn("[Firestore Scripture Loader] Error fetching direct Hinduism Bhagavad Gita path:", e);
      }
    }

    // Check if we are loading Rigveda and search the specific path:
    // Holy Scripture Books -> Hinduism -> Rigveda (ऋग्वेद) -> [mandalDoc] -> verses
    if (k === "rigveda") {
      try {
        let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Rigveda (ऋग्वेद)");
        let snap;
        try {
          const q = query(directColRef, orderBy("mandal_number", "asc"));
          snap = await getDocs(q);
        } catch (queryChErr) {
          console.warn("[Firestore Scripture Loader] Failed direct Rigveda mandala query with orderBy, trying unordered:", queryChErr);
          snap = await getDocs(directColRef);
        }
        
        if (snap.empty) {
          console.log("[Firestore Scripture Loader] Subcollection 'Rigveda (ऋग्वेद)' empty or not found. Falling back to 'Rigveda'...");
          directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Rigveda");
          try {
            const q = query(directColRef, orderBy("mandal_number", "asc"));
            snap = await getDocs(q);
          } catch (queryChErr) {
            console.warn("[Firestore Scripture Loader] Failed fallback Rigveda mandala query, trying unordered:", queryChErr);
            snap = await getDocs(directColRef);
          }
        }
        
        if (!snap.empty) {
          const match = snap.docs.find((docSnap) => {
            const data = docSnap.data();
            const mNum = data.mandal_number ?? data.mandalNumber ?? data.mandal ?? data.chapter_number ?? data.chapterNumber ?? data.chapter ?? data.number ?? docSnap.id;
            const parsedId = Number(docSnap.id.replace(/[^0-9]/g, ""));
            return Number(mNum) === div || parsedId === div;
          });
          
          if (match) {
            const versesCol = collection(match.ref, "verses");
            let versesSnap;
            try {
              const q = query(versesCol, orderBy("verse_number", "asc"));
              versesSnap = await getDocs(q);
            } catch (queryVerr) {
              console.warn("[Firestore Scripture Loader] Failed direct Rigveda verses query with orderBy, trying unordered:", queryVerr);
              versesSnap = await getDocs(versesCol);
            }
            if (!versesSnap.empty) {
              console.log(`[Firestore Scripture Loader] Hit: Found ${versesSnap.size} verses for Rigveda mandala ${div} in direct path: 'Holy Scripture Books' -> 'Hinduism' -> 'Rigveda (ऋग्वेद)'`);
              return formatFirestoreVerses(versesSnap.docs, div, bookKey);
            }
          }
        }
      } catch (e) {
        console.warn("[Firestore Scripture Loader] Error fetching direct Hinduism Rigveda path:", e);
      }
    }

    // Check if we are loading Ramayana and search the specific path:
    // Holy Scripture Books -> Hinduism -> Ramayana (रामायणम्) -> [kandaDoc] -> sargas
    if (k === "ramayana") {
      try {
        let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Ramayana (रामायणम्)");
        let snap;
        try {
          const q = query(directColRef, orderBy("mandal_number", "asc"));
          snap = await getDocs(q);
        } catch (queryChErr) {
          try {
            const q = query(directColRef, orderBy("kanda_number", "asc"));
            snap = await getDocs(q);
          } catch (queryChErr2) {
            console.warn("[Firestore Scripture Loader] Failed direct Ramayana (रामायणम्) kanda query with orderBy, trying unordered:", queryChErr2);
            snap = await getDocs(directColRef);
          }
        }
        
        if (snap.empty) {
          console.log("[Firestore Scripture Loader] Subcollection 'Ramayana (रामायणम्)' empty or not found. Falling back to 'Ramayana (रामायण)'...");
          directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Ramayana (रामायण)");
          try {
            const q = query(directColRef, orderBy("mandal_number", "asc"));
            snap = await getDocs(q);
          } catch (queryChErr) {
            try {
              const q = query(directColRef, orderBy("kanda_number", "asc"));
              snap = await getDocs(q);
            } catch (queryChErr2) {
              snap = await getDocs(directColRef);
            }
          }
        }

        if (snap.empty) {
          console.log("[Firestore Scripture Loader] Subcollection 'Ramayana (रामायण)' empty or not found. Falling back to 'Ramayana'...");
          directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Ramayana");
          try {
            const q = query(directColRef, orderBy("mandal_number", "asc"));
            snap = await getDocs(q);
          } catch (queryChErr) {
            try {
              const q = query(directColRef, orderBy("kanda_number", "asc"));
              snap = await getDocs(q);
            } catch (queryChErr2) {
              snap = await getDocs(directColRef);
            }
          }
        }
        
        if (!snap.empty) {
          const match = snap.docs.find((docSnap) => {
            const data = docSnap.data();
            const kNum = data.mandal_number ?? data.kanda_number ?? data.kandaNumber ?? data.chapter_number ?? data.chapterNumber ?? data.chapter ?? data.number ?? docSnap.id;
            const parsedId = Number(docSnap.id.replace(/[^0-9]/g, ""));
            return Number(kNum) === div || parsedId === div;
          });
          
          if (match) {
            const sargasCol = collection(match.ref, "sargas");
            let sargasSnap;
            try {
              const q = query(sargasCol, orderBy("sarga_number", "asc"));
              sargasSnap = await getDocs(q);
            } catch (queryVerr) {
              console.warn("[Firestore Scripture Loader] Failed direct Ramayana sargas query with orderBy sarga_number, trying unordered:", queryVerr);
              sargasSnap = await getDocs(sargasCol);
            }
            if (!sargasSnap.empty) {
              console.log(`[Firestore Scripture Loader] Hit: Found ${sargasSnap.size} sargas for Ramayana kanda ${div} in direct path. Loading nested verses...`);
              
              const sargaDocs = sargasSnap.docs;
              const allVersesPromises = sargaDocs.map(async (sargaDoc) => {
                const sData = sargaDoc.data();
                const sNum = Number(sData.sarga_number ?? sData.number ?? sargaDoc.id.replace(/[^0-9]/g, "") ?? 1);
                
                const versesCol = collection(sargaDoc.ref, "verses");
                let versesSnap;
                try {
                  const q = query(versesCol, orderBy("verse_number", "asc"));
                  versesSnap = await getDocs(q);
                } catch (err) {
                  versesSnap = await getDocs(versesCol);
                }
                
                return versesSnap.docs.map((vDoc) => {
                  const vData = vDoc.data();
                  const vNum = Number(vData.verse_number ?? vData.number ?? vDoc.id.replace(/[^0-9]/g, "") ?? 1);
                  const refVal = vData.reference ? String(vData.reference) : `${div}.${sNum}.${vNum}`;
                  return {
                    number: refVal,
                    originalText: vData.text ?? vData.originalText ?? vData.cleanText ?? vData.text_content ?? "",
                    transliteration: vData.itx || vData.transliteration || "",
                    translation: vData.translation || vData.english || ""
                  };
                });
              });
              
              const resolvedVersesNested = await Promise.all(allVersesPromises);
              const flattenedVerses = resolvedVersesNested.flat();
              
              // Sort the flattened verses by their parsed kanda.sarga.verse numbers
              flattenedVerses.sort((a, b) => {
                const partsA = String(a.number).split(".").map(Number);
                const partsB = String(b.number).split(".").map(Number);
                
                // Compare Kanda
                if (partsA[0] !== partsB[0]) return (partsA[0] || 0) - (partsB[0] || 0);
                // Compare Sarga
                if (partsA[1] !== partsB[1]) return (partsA[1] || 0) - (partsB[1] || 0);
                // Compare Verse
                return (partsA[2] || 0) - (partsB[2] || 0);
              });

              return {
                introSummary: `Loaded Kanda ${div} (Ramayana) directly from your custom database 'interfaith-108' in Firestore.`,
                verses: flattenedVerses,
                commentary: `### Scholarly Commentary\n\nThis Ramayana text was retrieved from your custom uploaded repository inside Firestore ('interfaith-108').`,
                interfaithParallels: [
                  {
                    religion: "Interfaith Insights",
                    source: "Academy Ledger",
                    similarity: "Matches with verified spiritual insights from world traditions.",
                    lesson: "Always follow the path of truth, righteousness, and devotion."
                  }
                ]
              };
            }
          }
        }
      } catch (e) {
        console.warn("[Firestore Scripture Loader] Error fetching direct Hinduism Ramayana path:", e);
      }
    }

    // Check if we are loading Mahabharata and search the specific path:
    // Holy Scripture Books -> Hinduism -> Mahabharata (महाभारतम्) -> [parvaDoc] -> adhyayas -> [adhyayaDoc] -> verses
    if (k === "mahabharata") {
      try {
        let directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Mahabharata (महाभारतम्)");
        let snap;
        try {
          const q = query(directColRef, orderBy("parva_number", "asc"));
          snap = await getDocs(q);
        } catch (queryChErr) {
          try {
            const q = query(directColRef, orderBy("chapter_number", "asc"));
            snap = await getDocs(q);
          } catch (queryChErr2) {
            console.warn("[Firestore Scripture Loader] Failed direct Mahabharata parva query with orderBy, trying unordered:", queryChErr2);
            snap = await getDocs(directColRef);
          }
        }
        
        if (snap.empty) {
          console.log("[Firestore Scripture Loader] Subcollection 'Mahabharata (महाभारतम्)' empty or not found. Falling back to 'Mahabharata'...");
          directColRef = collection(db, "Holy Scripture Books", "Hinduism", "Mahabharata");
          try {
            const q = query(directColRef, orderBy("parva_number", "asc"));
            snap = await getDocs(q);
          } catch (queryChErr) {
            try {
              const q = query(directColRef, orderBy("chapter_number", "asc"));
              snap = await getDocs(q);
            } catch (queryChErr2) {
              snap = await getDocs(directColRef);
            }
          }
        }
        
        if (!snap.empty) {
          const match = snap.docs.find((docSnap) => {
            const data = docSnap.data();
            const parvaNum = data.parva_number ?? data.parvaNumber ?? data.parva ?? data.chapter_number ?? data.chapterNumber ?? data.chapter ?? data.number ?? docSnap.id;
            const parsedId = Number(docSnap.id.replace(/[^0-9]/g, ""));
            return Number(parvaNum) === div || parsedId === div;
          });
          
          if (match) {
            const adhyayasCol = collection(match.ref, "adhyayas");
            let adhyayasSnap;
            try {
              const q = query(adhyayasCol, orderBy("adhyaya_number", "asc"));
              adhyayasSnap = await getDocs(q);
            } catch (queryVerr) {
              try {
                const q = query(adhyayasCol, orderBy("chapter_number", "asc"));
                adhyayasSnap = await getDocs(q);
              } catch (queryVerr2) {
                console.warn("[Firestore Scripture Loader] Failed direct Mahabharata adhyayas query with orderBy, trying unordered:", queryVerr2);
                adhyayasSnap = await getDocs(adhyayasCol);
              }
            }
            
            if (!adhyayasSnap.empty) {
              console.log(`[Firestore Scripture Loader] Hit: Found ${adhyayasSnap.size} adhyayas for Mahabharata parva ${div} in direct path. Loading nested verses...`);
              
              const adhyayaDocs = adhyayasSnap.docs;
              const allVersesPromises = adhyayaDocs.map(async (adhyayaDoc) => {
                const aData = adhyayaDoc.data();
                const aNum = Number(aData.adhyaya_number ?? aData.adhyayaNumber ?? aData.adhyaya ?? aData.chapter_number ?? aData.chapterNumber ?? aData.chapter ?? aData.number ?? adhyayaDoc.id.replace(/[^0-9]/g, "") ?? 1);
                
                const versesCol = collection(adhyayaDoc.ref, "verses");
                let versesSnap;
                try {
                  const q = query(versesCol, orderBy("verse_number", "asc"));
                  versesSnap = await getDocs(q);
                } catch (err) {
                  versesSnap = await getDocs(versesCol);
                }
                
                return versesSnap.docs.map((vDoc) => {
                  const vData = vDoc.data();
                  const vNum = Number(vData.verse_number ?? vData.number ?? vDoc.id.replace(/[^0-9]/g, "") ?? 1);
                  const refVal = vData.reference ? String(vData.reference) : `${div}.${aNum}.${vNum}`;
                  return {
                    number: refVal,
                    originalText: vData.text ?? vData.originalText ?? vData.cleanText ?? vData.text_content ?? "",
                    transliteration: vData.itx || vData.transliteration || "",
                    translation: vData.translation || vData.english || ""
                  };
                });
              });
              
              const resolvedVersesNested = await Promise.all(allVersesPromises);
              const flattenedVerses = resolvedVersesNested.flat();
              
              // Sort the flattened verses by their parsed parva.adhyaya.verse numbers
              flattenedVerses.sort((a, b) => {
                const partsA = String(a.number).split(".").map(Number);
                const partsB = String(b.number).split(".").map(Number);
                
                // Compare Parva
                if (partsA[0] !== partsB[0]) return (partsA[0] || 0) - (partsB[0] || 0);
                // Compare Adhyaya
                if (partsA[1] !== partsB[1]) return (partsA[1] || 0) - (partsB[1] || 0);
                // Compare Verse
                return (partsA[2] || 0) - (partsB[2] || 0);
              });

              return {
                introSummary: `Loaded Parva ${div} (Mahabharata) directly from your custom database 'interfaith-108' in Firestore.`,
                verses: flattenedVerses,
                commentary: `### Scholarly Commentary\n\nThis Mahabharata text was retrieved from your custom uploaded repository inside Firestore ('interfaith-108').`,
                interfaithParallels: [
                  {
                    religion: "Interfaith Insights",
                    source: "Academy Ledger",
                    similarity: "Matches with verified spiritual insights from world traditions.",
                    lesson: "Always follow the path of truth, righteousness, and devotion."
                  }
                ]
              };
            }
          }
        }
      } catch (e) {
        console.warn("[Firestore Scripture Loader] Error fetching direct Hinduism Mahabharata path:", e);
      }
    }

    // Check if we are loading Yajurveda and search the specific path:
    // Collection Path: Holy Scripture Books/Hinduism/Yajurveda (यजुर्वेदः)
    // Shukla branch: shukla/chapters -> verses
    // Krishna branch: krishna/kandas -> prashnas -> verses
    if (k === "yajurveda" || k.startsWith("yajurveda")) {
      const branchOpt = typeof options === "string" ? options : options?.branch;
      const prashnaNumOpt = typeof options === "object" ? options?.prashnaNumber : undefined;
      const selectedBranch = branchOpt || (k.includes("shukla") ? "shukla" : k.includes("krishna") ? "krishna" : undefined);

      // --- SHUKLA BRANCH FETCHING ---
      if (selectedBranch === "shukla" || !selectedBranch) {
        try {
          const shuklaDocRef = doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "shukla");
          const chaptersColRef = collection(shuklaDocRef, "chapters");
          let chapSnap;
          try {
            chapSnap = await getDocs(query(chaptersColRef, orderBy("chapter_number", "asc")));
          } catch (e) {
            chapSnap = await getDocs(chaptersColRef);
          }

          if (!chapSnap.empty) {
            const matchChapter = chapSnap.docs.find((cDoc) => {
              const d = cDoc.data();
              const cNum = d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.number ?? cDoc.id;
              const parsedId = Number(cDoc.id.replace(/[^0-9]/g, ""));
              return Number(cNum) === div || parsedId === div;
            });

            if (matchChapter) {
              const versesCol = collection(matchChapter.ref, "verses");
              let versesSnap;
              try {
                versesSnap = await getDocs(query(versesCol, orderBy("verse_number", "asc")));
              } catch (e) {
                versesSnap = await getDocs(versesCol);
              }

              if (!versesSnap.empty) {
                console.log(`[Firestore Scripture Loader] Hit: Found ${versesSnap.size} verses for Shukla Yajurveda chapter ${div}.`);
                return formatFirestoreVerses(versesSnap.docs, div, "yajurveda_shukla");
              }
            }
          }
        } catch (shuklaErr) {
          console.warn("[Firestore Scripture Loader] Shukla branch scan error:", shuklaErr);
        }
      }

      // --- KRISHNA BRANCH FETCHING ---
      if (selectedBranch === "krishna" || !selectedBranch) {
        try {
          const krishnaCandidates = [
            doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna"),
            doc(db, "books", "Yajurveda_Krishna"),
            doc(db, "Holy Scripture Books", "Hinduism", "Yajurveda_Krishna", "krishna")
          ];

          for (const krishnaDocRef of krishnaCandidates) {
            const kandasColRef = collection(krishnaDocRef, "kandas");
            let kandaSnap;
            try {
              kandaSnap = await getDocs(query(kandasColRef, orderBy("kanda_number", "asc")));
            } catch (e) {
              try {
                kandaSnap = await getDocs(kandasColRef);
              } catch (e2) {}
            }

            if (kandaSnap && !kandaSnap.empty) {
              const matchKanda = kandaSnap.docs.find((kDoc) => {
                const d = kDoc.data();
                const kNum = d.kanda_number ?? d.kandaNumber ?? d.kanda ?? d.chapter_number ?? d.number ?? kDoc.id;
                const parsedId = Number(kDoc.id.replace(/[^0-9]/g, ""));
                return Number(kNum) === div || parsedId === div;
              });

              if (matchKanda) {
                let prashnasSnap = null;
                const prashnaSubcols = ["prashanas", "prashnas", "adhyayas", "chapters"];
                for (const pSub of prashnaSubcols) {
                  const pCol = collection(matchKanda.ref, pSub);
                  try {
                    let testSnap;
                    try {
                      testSnap = await getDocs(query(pCol, orderBy("prashana_number", "asc")));
                    } catch (e) {
                      try {
                        testSnap = await getDocs(query(pCol, orderBy("prashna_number", "asc")));
                      } catch (e2) {
                        testSnap = await getDocs(pCol);
                      }
                    }
                    if (!testSnap.empty) {
                      prashnasSnap = testSnap;
                      break;
                    }
                  } catch (err) {}
                }

                if (prashnasSnap && !prashnasSnap.empty) {
                  let prashnaDocs = prashnasSnap.docs;
                  if (prashnaNumOpt) {
                    const filtered = prashnaDocs.filter((pDoc) => {
                      const d = pDoc.data();
                      const pNum = d.prashana_number ?? d.prashanaNumber ?? d.prashna_number ?? d.prashnaNumber ?? d.prashna ?? d.prashana ?? d.chapter_number ?? d.number ?? pDoc.id;
                      const parsedId = Number(pDoc.id.replace(/[^0-9]/g, ""));
                      return Number(pNum) === prashnaNumOpt || parsedId === prashnaNumOpt;
                    });
                    if (filtered.length > 0) prashnaDocs = filtered;
                  }

                  console.log(`[Firestore Scripture Loader] Hit: Found ${prashnaDocs.length} prashanas for Krishna Yajurveda Kanda ${div}. Loading verses...`);
                  const allVersesPromises = prashnaDocs.map(async (pDoc) => {
                    const pData = pDoc.data();
                    const pNum = Number(pData.prashana_number ?? pData.prashanaNumber ?? pData.prashna_number ?? pData.prashnaNumber ?? pData.prashna ?? pData.prashana ?? pData.number ?? pDoc.id.replace(/[^0-9]/g, "") ?? 1);

                    const vCol = collection(pDoc.ref, "verses");
                    let vSnap;
                    try {
                      vSnap = await getDocs(query(vCol, orderBy("verse_number", "asc")));
                    } catch (e) {
                      vSnap = await getDocs(vCol);
                    }

                    return vSnap.docs.map((vDoc) => {
                      const vData = vDoc.data();
                      const vNum = Number(vData.verse_number ?? vData.number ?? vDoc.id.replace(/[^0-9]/g, "") ?? 1);
                      const refVal = vData.reference ? String(vData.reference) : `${div}.${pNum}.${vNum}`;
                      return {
                        number: refVal,
                        originalText: vData.text ?? vData.originalText ?? vData.cleanText ?? vData.text_content ?? "",
                        transliteration: vData.itx || vData.transliteration || "",
                        translation: vData.translation || vData.english || ""
                      };
                    });
                  });

                  const resolvedVersesNested = await Promise.all(allVersesPromises);
                  const flattenedVerses = resolvedVersesNested.flat();

                  flattenedVerses.sort((a, b) => {
                    const partsA = String(a.number).split(".").map(Number);
                    const partsB = String(b.number).split(".").map(Number);
                    if (partsA[0] !== partsB[0]) return (partsA[0] || 0) - (partsB[0] || 0);
                    if (partsA[1] !== partsB[1]) return (partsA[1] || 0) - (partsB[1] || 0);
                    return (partsA[2] || 0) - (partsB[2] || 0);
                  });

                  return {
                    introSummary: `Loaded Kanda ${div} (Krishna Yajurveda) directly from your custom database 'interfaith-108' in Firestore.`,
                    verses: flattenedVerses,
                    commentary: `### Scholarly Commentary\n\nThis Yajurveda text was retrieved from your custom uploaded repository inside Firestore ('interfaith-108').`,
                    interfaithParallels: [
                      {
                        religion: "Interfaith Insights",
                        source: "Academy Ledger",
                        similarity: "Matches with verified spiritual insights from world traditions.",
                        lesson: "Always follow the path of truth, righteousness, and devotion."
                      }
                    ]
                  };
                } else {
                  const vCol = collection(matchKanda.ref, "verses");
                  let vSnap;
                  try {
                    vSnap = await getDocs(query(vCol, orderBy("verse_number", "asc")));
                  } catch (e) {
                    vSnap = await getDocs(vCol);
                  }
                  if (!vSnap.empty) {
                    return formatFirestoreVerses(vSnap.docs, div, bookKey);
                  }
                }
              }
            }
          }
        } catch (krishnaErr) {
          console.warn("[Firestore Scripture Loader] Krishna branch scan error:", krishnaErr);
        }
      }
    }

    // Check if we are loading Mahapuranas and search the specific path:
    // Holy Scripture Books -> Hinduism -> Mahapuranas (महापुराणाणि) -> [puranaDoc]
    if (k === "mahapuranas" || k.includes("purana")) {
      try {
        const candidatePuranasCols = [
          collection(db, "Holy Scripture Books", "Hinduism", "Mahapuranas (महापुराणाणि)"),
          collection(db, "Holy Scripture Books", "Hinduism", "Mahapuranas"),
          collection(db, "Holy Scripture Books", "Hinduism", "Puranas"),
          collection(db, "Holy Scripture Books", "Hinduism", "Puranas (पुराणानी)"),
          collection(db, "Mahapuranas (महापुराणाणि)"),
          collection(db, "Mahapuranas")
        ];

        let puranasSnap = null;
        for (const pColRef of candidatePuranasCols) {
          try {
            let snap;
            try {
              snap = await getDocs(query(pColRef, orderBy("purana_number", "asc")));
            } catch {
              snap = await getDocs(pColRef);
            }
            if (snap && !snap.empty) {
              puranasSnap = snap;
              break;
            }
          } catch (e) {}
        }

        if (puranasSnap && !puranasSnap.empty) {
          const puranaOpt = typeof options === "string" 
            ? options 
            : (options?.puranaName || options?.purana || options?.puranaDoc || options?.puranaId || options?.bookTitle || options?.title);

          let matchedPuranaDoc = null;

          if (puranaOpt) {
            const normOpt = String(puranaOpt).toLowerCase().trim();
            matchedPuranaDoc = puranasSnap.docs.find((pDoc) => {
              const d = pDoc.data();
              const pTitle = String(d.book_title || d.title || d.name || pDoc.id).toLowerCase().trim();
              return pDoc.id.toLowerCase().trim() === normOpt || pTitle === normOpt || pTitle.includes(normOpt) || normOpt.includes(pTitle);
            });
          }

          if (!matchedPuranaDoc && div) {
            matchedPuranaDoc = puranasSnap.docs.find((pDoc, idx) => {
              const d = pDoc.data();
              const pNum = Number(d.purana_number ?? d.puranaNumber ?? d.number ?? d.chapter_number ?? d.chapterNumber ?? (idx + 1));
              return pNum === div || Number(pDoc.id.replace(/[^0-9]/g, "")) === div;
            });
          }

          if (!matchedPuranaDoc && puranasSnap.docs.length > 0) {
            matchedPuranaDoc = puranasSnap.docs[0];
          }

          if (matchedPuranaDoc) {
            const pData = matchedPuranaDoc.data();
            const puranaName = matchedPuranaDoc.id;
            const puranaTitle = pData.book_title || pData.title || puranaName;
            const isShivaPurana = puranaName.toLowerCase().includes("shiva") || String(puranaTitle).toLowerCase().includes("shiva");

            if (isShivaPurana) {
              // --- SHIVA PURANA: samhitas -> chapters -> verses ---
              // Collection Path: Holy Scripture Books/Hinduism/Mahapuranas (महापुराणाणि)/Shiva Purana/samhitas
              const samhitasColRef = collection(matchedPuranaDoc.ref, "samhitas");
              let samhitasSnap;
              try {
                samhitasSnap = await getDocs(query(samhitasColRef, orderBy("samhita_number", "asc")));
              } catch {
                samhitasSnap = await getDocs(samhitasColRef);
              }

              if (!samhitasSnap.empty) {
                const samhitaOpt = typeof options === "object" ? (options?.samhitaNumber || options?.samhita) : undefined;
                let samhitaDocsToScan = samhitasSnap.docs;

                if (samhitaOpt) {
                  const matchSamhita = samhitasSnap.docs.find((sDoc) => {
                    const sd = sDoc.data();
                    const sNum = sd.samhita_number ?? sd.samhitaNumber ?? sd.number ?? sDoc.id.replace(/[^0-9]/g, "");
                    return Number(sNum) === Number(samhitaOpt) || sDoc.id === String(samhitaOpt);
                  });
                  if (matchSamhita) {
                    samhitaDocsToScan = [matchSamhita];
                  }
                }

                const targetChapNum = typeof options === "object" && options?.chapterNumber !== undefined 
                  ? Number(options.chapterNumber) 
                  : div;

                let allVersesFound: any[] = [];

                for (const sDoc of samhitaDocsToScan) {
                  const sData = sDoc.data();
                  const sNum = Number(sData.samhita_number ?? sData.samhitaNumber ?? (sDoc.id.replace(/[^0-9]/g, "") || 1));

                  const chapColRef = collection(sDoc.ref, "chapters");
                  let chapSnap;
                  try {
                    chapSnap = await getDocs(query(chapColRef, orderBy("chapter_number", "asc")));
                  } catch {
                    chapSnap = await getDocs(chapColRef);
                  }

                  if (!chapSnap.empty) {
                    let chapDocsToScan = chapSnap.docs;
                    if (targetChapNum) {
                      const matchChap = chapSnap.docs.find((cDoc) => {
                        const cd = cDoc.data();
                        const cNum = cd.chapter_number ?? cd.chapterNumber ?? cd.number ?? cDoc.id.replace(/[^0-9]/g, "");
                        return Number(cNum) === targetChapNum;
                      });
                      if (matchChap) {
                        chapDocsToScan = [matchChap];
                      }
                    }

                    for (const cDoc of chapDocsToScan) {
                      const cd = cDoc.data();
                      const cNum = Number(cd.chapter_number ?? cd.chapterNumber ?? (cDoc.id.replace(/[^0-9]/g, "") || 1));

                      const versesColRef = collection(cDoc.ref, "verses");
                      let versesSnap;
                      try {
                        versesSnap = await getDocs(query(versesColRef, orderBy("verse_number", "asc")));
                      } catch {
                        versesSnap = await getDocs(versesColRef);
                      }

                      if (!versesSnap.empty) {
                        const formatted = versesSnap.docs.map((vDoc) => {
                          const vd = vDoc.data();
                          const vNum = Number(vd.verse_number ?? vd.verseNumber ?? vd.number ?? (vDoc.id.replace(/[^0-9]/g, "") || 1));
                          const refVal = vd.reference ? String(vd.reference) : `${sNum}.${cNum}.${vNum}`;
                          return {
                            number: refVal,
                            originalText: vd.text ?? vd.originalText ?? vd.cleanText ?? vd.text_content ?? "",
                            transliteration: vd.itx || vd.transliteration || vd.phonetic || vd.roman || "",
                            translation: vd.translation || vd.english || ""
                          };
                        });
                        allVersesFound.push(...formatted);
                      }
                    }
                  }
                }

                if (allVersesFound.length > 0) {
                  console.log(`[Firestore Scripture Loader] Hit: Found ${allVersesFound.length} verses for Shiva Purana in custom database 'interfaith-108'.`);
                  return {
                    introSummary: `Loaded ${puranaTitle} directly from your custom database 'interfaith-108' in Firestore.`,
                    verses: allVersesFound,
                    commentary: `### Scholarly Commentary\n\nThis Shiva Purana text was retrieved from your custom uploaded repository inside Firestore ('interfaith-108').`,
                    interfaithParallels: [
                      {
                        religion: "Interfaith Insights",
                        source: "Academy Ledger",
                        similarity: "Matches with verified spiritual insights from world traditions.",
                        lesson: "Always follow the path of truth, righteousness, and devotion."
                      }
                    ]
                  };
                }
              }
            } else {
              // --- 12 SINGLE-BRANCH PURANAS: chapters -> verses ---
              // Collection Path: Holy Scripture Books/Hinduism/Mahapuranas (महापुराणाणि)/{puranaName}/chapters
              const chaptersColRef = collection(matchedPuranaDoc.ref, "chapters");
              let chapSnap;
              try {
                chapSnap = await getDocs(query(chaptersColRef, orderBy("chapter_number", "asc")));
              } catch {
                chapSnap = await getDocs(chaptersColRef);
              }

              if (!chapSnap.empty) {
                const targetChapNum = typeof options === "object" && options?.chapterNumber !== undefined 
                  ? Number(options.chapterNumber) 
                  : div;

                let matchChap = chapSnap.docs.find((cDoc) => {
                  const cd = cDoc.data();
                  const cNum = cd.chapter_number ?? cd.chapterNumber ?? cd.number ?? cDoc.id.replace(/[^0-9]/g, "");
                  return Number(cNum) === targetChapNum;
                });

                if (!matchChap && chapSnap.docs.length > 0) {
                  matchChap = chapSnap.docs[0];
                }

                if (matchChap) {
                  const versesColRef = collection(matchChap.ref, "verses");
                  let versesSnap;
                  try {
                    versesSnap = await getDocs(query(versesColRef, orderBy("verse_number", "asc")));
                  } catch {
                    versesSnap = await getDocs(versesColRef);
                  }

                  if (!versesSnap.empty) {
                    console.log(`[Firestore Scripture Loader] Hit: Found ${versesSnap.size} verses for ${puranaTitle} chapter ${targetChapNum} in custom database 'interfaith-108'.`);
                    return formatFirestoreVerses(versesSnap.docs, targetChapNum, bookKey);
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        console.warn("[Firestore Scripture Loader] Error fetching Mahapuranas path:", e);
      }
    }

    const candidateBookIds = [
      k === "bhagavad_gita" ? "Bhagavad Gita (श्रीमद्भगवद्गीता)" : "",
      k === "bhagavad_gita" ? "Bhagavad Gita" : "",
      k === "rigveda" ? "Rigveda (ऋग्वेद)" : "",
      k === "rigveda" ? "Rigveda" : "",
      k === "ramayana" ? "Ramayana (रामायणम्)" : "",
      k === "ramayana" ? "Ramayana (रामायण)" : "",
      k === "ramayana" ? "Ramayana" : "",
      k === "mahabharata" ? "Mahabharata (महाभारतम्)" : "",
      k === "mahabharata" ? "Mahabharata" : "",
      k === "yajurveda" ? "Yajurveda (यजुर्वेदः)" : "",
      k === "yajurveda" ? "Yajurveda (यजुर्वेद)" : "",
      k === "yajurveda" ? "Yajurveda" : "",
      k === "mahapuranas" || k.includes("purana") ? "Mahapuranas (महापुराणाणि)" : "",
      k === "mahapuranas" || k.includes("purana") ? "Mahapuranas" : "",
      bookKey,
      bookKey.charAt(0).toUpperCase() + bookKey.slice(1).replace(/_/g, " "),
    ].filter(Boolean);

    for (const bookId of candidateBookIds) {
      const bookDocRef = doc(db, "Holy Scripture Books", bookId);
      const chapterSubcolNames = ["chapters", "Chapters", "divisions", "Divisions"];
      
      for (const subcolName of chapterSubcolNames) {
        try {
          const chapCol = collection(db, "Holy Scripture Books", bookId, subcolName);
          let chapSnap;
          try {
            const q = query(chapCol, orderBy("chapter_number", "asc"));
            chapSnap = await getDocs(q);
          } catch (e) {
            chapSnap = await getDocs(chapCol);
          }
          
          if (!chapSnap.empty) {
            // Find chapter document where chapter_number == div
            const match = chapSnap.docs.find((docSnap) => {
              const data = docSnap.data();
              const chNum = data.chapter_number ?? data.chapterNumber ?? data.chapter ?? data.number ?? docSnap.id;
              return Number(chNum) === div;
            });
            
            if (match) {
              const versesCol = collection(match.ref, "verses");
              let versesSnap;
              try {
                const q = query(versesCol, orderBy("verse_number", "asc"));
                versesSnap = await getDocs(q);
              } catch (e) {
                versesSnap = await getDocs(versesCol);
              }
              
              if (!versesSnap.empty) {
                console.log(`[Firestore Scripture Loader] Hit: Found ${versesSnap.size} verses for chapter ${div} in 'Holy Scripture Books' -> '${bookId}' -> '${subcolName}'`);
                return formatFirestoreVerses(versesSnap.docs, div, bookKey);
              }
            }
          }
        } catch (e) {
          // Ignore individual subcollection query errors
        }
      }
    }

    // Try direct document scan in "Holy Scripture Books" where each direct document could represent a chapter
    try {
      const rootCol = collection(db, "Holy Scripture Books");
      let rootSnap;
      try {
        const q = query(rootCol, orderBy("chapter_number", "asc"));
        rootSnap = await getDocs(q);
      } catch (e) {
        rootSnap = await getDocs(rootCol);
      }
      if (!rootSnap.empty) {
        for (const docSnap of rootSnap.docs) {
          const data = docSnap.data();
          const matchesBook = 
            String(data.book || data.bookTitle || data.book_title || docSnap.id || "").toLowerCase().includes(k.replace(/_/g, " ")) ||
            String(data.id || "").toLowerCase().includes(k.replace(/_/g, " "));
          
          const chNum = data.chapter_number ?? data.chapterNumber ?? data.chapter ?? data.number;
          if (matchesBook && Number(chNum) === div) {
            const versesCol = collection(docSnap.ref, "verses");
            let versesSnap;
            try {
              const q = query(versesCol, orderBy("verse_number", "asc"));
              versesSnap = await getDocs(q);
            } catch (e) {
              versesSnap = await getDocs(versesCol);
            }
            if (!versesSnap.empty) {
              console.log(`[Firestore Scripture Loader] Hit: Found ${versesSnap.size} verses under direct chapter doc ${docSnap.id} in 'Holy Scripture Books'`);
              return formatFirestoreVerses(versesSnap.docs, div, bookKey);
            }
          }
        }
      }
    } catch (e) {
      console.warn("[Firestore Scripture Loader] Direct root scan failed:", e);
    }
    
    // Check default subcollection scriptures/{bookKey}/verses
    const versesRef = collection(db, "scriptures", k, "verses");
    const snapshot = await getDocs(versesRef);
    
    if (snapshot.empty) {
      // Try alternative flat collection: verses (filtered by bookKey)
      const flatRef = collection(db, "verses");
      const q = query(flatRef, where("bookKey", "==", k));
      const flatSnapshot = await getDocs(q);
      
      if (flatSnapshot.empty) {
        return null;
      }
      
      const docs = flatSnapshot.docs.filter((docSnap) => {
        const d = docSnap.data();
        return (
          Number(d.chapter) === div ||
          Number(d.division) === div ||
          Number(d.mandala) === div ||
          Number(d.divisionNumber) === div ||
          docSnap.id.startsWith(`${div}.`) ||
          docSnap.id.startsWith(`0${div}.`) ||
          docSnap.id.includes(`.${div}.`)
        );
      });
      
      if (docs.length === 0) {
        return null;
      }
      
      return formatFirestoreVerses(docs, div, bookKey);
    }
    
    // If we have subcollection scriptures/{bookKey}/verses, filter docs by chapter/division
    const docs = snapshot.docs.filter((docSnap) => {
      const d = docSnap.data();
      return (
        Number(d.chapter) === div ||
        Number(d.division) === div ||
        Number(d.mandala) === div ||
        Number(d.divisionNumber) === div ||
        docSnap.id.startsWith(`${div}.`) ||
        docSnap.id.startsWith(`0${div}.`) ||
        docSnap.id.includes(`.${div}.`)
      );
    });
    
    if (docs.length === 0) {
      return null;
    }
    
    return formatFirestoreVerses(docs, div, bookKey);
  } catch (error) {
    console.warn("Firestore scripture lookup skipped or not found:", error);
    return null;
  }
}


export interface YajurvedaVerse {
  number: string;
  originalText: string;
  transliteration: string;
  translation: string;
  reference?: string;
  verse_number?: number;
}

export interface YajurvedaResponse {
  branch: string;
  levelId: string | number;
  subLevelId?: string | number;
  verses: YajurvedaVerse[];
  introSummary: string;
  commentary: string;
  interfaithParallels: any[];
}

/**
 * Robust service function to fetch Yajurveda content from Firestore database (interfaith-108).
 * Handles:
 * - Shukla Yajurveda (2-tier: chapters -> verses)
 *   Path: books/Yajurveda/branches/Shukla/chapters/{chapter_id}/verses/{verse_id}
 * - Krishna Yajurveda (3-tier: kandas -> prashanas -> verses)
 *   Path: books/Yajurveda/branches/Krishna/kandas/{kanda_id}/prashanas/{prashana_id}/verses/{verse_id}
 */
export async function fetchYajurvedaContent(
  branch: string,
  levelId: string | number,
  subLevelId?: string | number
): Promise<YajurvedaResponse> {
  const normBranch = (branch || "").toLowerCase().trim();
  const isKrishna = normBranch.includes("krishna");
  const targetLevelNum = Number(levelId) || Number(String(levelId).replace(/[^0-9]/g, "")) || 1;
  const targetSubLevelNum = subLevelId !== undefined && subLevelId !== null && subLevelId !== "" 
    ? (Number(subLevelId) || Number(String(subLevelId).replace(/[^0-9]/g, "")) || 1) 
    : undefined;

  let verses: YajurvedaVerse[] = [];

  if (isKrishna) {
    // --- KRISHNA YAJURVEDA (3-tier: Kandas -> Prashanas -> Verses) ---
    const candidateKandaCols = [
      collection(db, "books", "Yajurveda", "branches", "Krishna", "kandas"),
      collection(db, "books", "Yajurveda_Krishna", "kandas"),
      collection(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "krishna", "kandas"),
      collection(db, "Holy Scripture Books", "Hinduism", "Yajurveda_Krishna", "krishna", "kandas")
    ];

    let matchedKandaDoc: any = null;

    for (const kColRef of candidateKandaCols) {
      try {
        let kSnap;
        try {
          kSnap = await getDocs(query(kColRef, orderBy("kanda_number", "asc")));
        } catch {
          kSnap = await getDocs(kColRef);
        }

        if (kSnap && !kSnap.empty) {
          const match = kSnap.docs.find((kDoc) => {
            const d = kDoc.data();
            const kNum = d.kanda_number ?? d.kandaNumber ?? d.kanda ?? d.chapter_number ?? d.number ?? kDoc.id;
            const parsedId = Number(String(kDoc.id).replace(/[^0-9]/g, ""));
            return Number(kNum) === targetLevelNum || parsedId === targetLevelNum || kDoc.id === String(levelId);
          });
          if (match) {
            matchedKandaDoc = match;
            break;
          }
        }
      } catch (err) {
        // Try next candidate
      }
    }

    if (matchedKandaDoc) {
      const prashnaSubcols = ["prashanas", "prashnas", "adhyayas", "chapters"];
      let prashnaDocs: any[] = [];

      for (const pSub of prashnaSubcols) {
        try {
          const pColRef = collection(matchedKandaDoc.ref, pSub);
          let pSnap;
          try {
            pSnap = await getDocs(query(pColRef, orderBy("prashana_number", "asc")));
          } catch {
            try {
              pSnap = await getDocs(query(pColRef, orderBy("prashna_number", "asc")));
            } catch {
              pSnap = await getDocs(pColRef);
            }
          }

          if (pSnap && !pSnap.empty) {
            if (targetSubLevelNum !== undefined) {
              const matchedP = pSnap.docs.filter((pDoc) => {
                const d = pDoc.data();
                const pNum = d.prashana_number ?? d.prashanaNumber ?? d.prashna_number ?? d.prashnaNumber ?? d.prashna ?? d.prashana ?? d.number ?? pDoc.id;
                const parsedId = Number(String(pDoc.id).replace(/[^0-9]/g, ""));
                return Number(pNum) === targetSubLevelNum || parsedId === targetSubLevelNum || pDoc.id === String(subLevelId);
              });
              if (matchedP.length > 0) {
                prashnaDocs = matchedP;
              } else {
                prashnaDocs = pSnap.docs;
              }
            } else {
              prashnaDocs = pSnap.docs;
            }
            break;
          }
        } catch (err) {
          // Try next subcollection name
        }
      }

      const allVersesPromises = prashnaDocs.map(async (pDoc) => {
        const pData = pDoc.data();
        const pNum = Number((pData.prashana_number ?? pData.prashanaNumber ?? pData.prashna_number ?? pData.prashnaNumber ?? pData.prashna ?? pData.prashana ?? pData.number ?? String(pDoc.id).replace(/[^0-9]/g, "")) || 1);

        const vColRef = collection(pDoc.ref, "verses");
        let vSnap;
        try {
          vSnap = await getDocs(query(vColRef, orderBy("verse_number", "asc")));
        } catch {
          vSnap = await getDocs(vColRef);
        }

        return vSnap.docs.map((vDoc, idx) => {
          const vData = vDoc.data();
          const vNum = Number((vData.verse_number ?? vData.verseNumber ?? vData.verse_num ?? vData.number ?? String(vDoc.id).replace(/[^0-9]/g, "")) || (idx + 1));
          const refVal = vData.reference ? String(vData.reference) : `${targetLevelNum}.${pNum}.${vNum}`;
          
          return {
            number: refVal,
            originalText: vData.originalText ?? vData.text ?? vData.cleanText ?? vData.text_content ?? "",
            transliteration: vData.transliteration ?? vData.itx ?? vData.roman ?? "",
            translation: vData.translation ?? vData.english ?? "",
            reference: refVal,
            verse_number: vNum
          };
        });
      });

      const nestedResults = await Promise.all(allVersesPromises);
      verses = nestedResults.flat();
    }
  } else {
    // --- SHUKLA YAJURVEDA (2-tier: Chapters -> Verses) ---
    const candidateChapterCols = [
      collection(db, "books", "Yajurveda", "branches", "Shukla", "chapters"),
      collection(db, "books", "Yajurveda_Shukla", "chapters"),
      collection(db, "Holy Scripture Books", "Hinduism", "Yajurveda (यजुर्वेदः)", "shukla", "chapters")
    ];

    let matchedChapterDoc: any = null;

    for (const cColRef of candidateChapterCols) {
      try {
        let cSnap;
        try {
          cSnap = await getDocs(query(cColRef, orderBy("chapter_number", "asc")));
        } catch {
          cSnap = await getDocs(cColRef);
        }

        if (cSnap && !cSnap.empty) {
          const match = cSnap.docs.find((cDoc) => {
            const d = cDoc.data();
            const cNum = d.chapter_number ?? d.chapterNumber ?? d.chapter ?? d.number ?? cDoc.id;
            const parsedId = Number(String(cDoc.id).replace(/[^0-9]/g, ""));
            return Number(cNum) === targetLevelNum || parsedId === targetLevelNum || cDoc.id === String(levelId);
          });
          if (match) {
            matchedChapterDoc = match;
            break;
          }
        }
      } catch (err) {
        // Continue checking candidates
      }
    }

    if (matchedChapterDoc) {
      const vColRef = collection(matchedChapterDoc.ref, "verses");
      let vSnap;
      try {
        vSnap = await getDocs(query(vColRef, orderBy("verse_number", "asc")));
      } catch {
        vSnap = await getDocs(vColRef);
      }

      if (vSnap && !vSnap.empty) {
        verses = vSnap.docs.map((vDoc, idx) => {
          const vData = vDoc.data();
          const vNum = Number((vData.verse_number ?? vData.verseNumber ?? vData.verse_num ?? vData.number ?? String(vDoc.id).replace(/[^0-9]/g, "")) || (idx + 1));
          const refVal = vData.reference ? String(vData.reference) : `${targetLevelNum}.${vNum}`;

          return {
            number: refVal,
            originalText: vData.originalText ?? vData.text ?? vData.cleanText ?? vData.text_content ?? "",
            transliteration: vData.transliteration ?? vData.itx ?? vData.roman ?? "",
            translation: vData.translation ?? vData.english ?? "",
            reference: refVal,
            verse_number: vNum
          };
        });
      }
    }
  }

  // Sort verses sequentially by reference / verse_number
  verses.sort((a, b) => {
    const partsA = String(a.number).split(".").map(Number);
    const partsB = String(b.number).split(".").map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const valA = partsA[i] ?? 0;
      const valB = partsB[i] ?? 0;
      if (valA !== valB) return valA - valB;
    }
    return (a.verse_number || 0) - (b.verse_number || 0);
  });

  const branchTitle = isKrishna ? "Krishna Yajurveda" : "Shukla Yajurveda";
  const levelTitle = isKrishna
    ? `Kanda ${levelId}${subLevelId !== undefined ? `, Prashana ${subLevelId}` : ""}`
    : `Chapter ${levelId}`;

  return {
    branch: isKrishna ? "Krishna" : "Shukla",
    levelId,
    subLevelId,
    verses,
    introSummary: `Loaded ${branchTitle} (${levelTitle}) directly from database 'interfaith-108' in Firestore.`,
    commentary: `### Scholarly Commentary\n\nRetrieved ${verses.length} verses from ${branchTitle} in Firestore ('interfaith-108').`,
    interfaithParallels: [
      {
        religion: "Interfaith Insights",
        source: "Academy Ledger",
        similarity: "Matches with verified spiritual insights from ancient world traditions.",
        lesson: "Always follow the path of truth, self-restraint, and devotion."
      }
    ]
  };
}

function formatFirestoreVerses(docs: any[], div: number, bookKey: string) {
  const verses = docs.map((docSnap) => {
    const d = docSnap.data();
    
    // Support all potential variations of verse keys, prioritizing specific fields, then ID
    let verseNum = d.verse_number || d.verseNumber || d.verse || d.number || d.verse_num || d.verse_no || d.verseNo || d.id || docSnap.id;
    
    // Convert to string for formatting
    let displayNum = String(verseNum);
    
    // Replace underscores with dots to beautifully format doc IDs like "1_10" into "1.10"
    if (displayNum.includes("_")) {
      displayNum = displayNum.replace(/_/g, ".");
    }
    
    // If it is a simple number (like 1, 2, 3), convert to chapter.verse format (like 1.1, 1.2, 1.3)
    // to match user expectations for Bhagavad Gita and other division-based scriptures.
    if (!displayNum.includes(".") && !displayNum.includes("-")) {
      displayNum = `${div}.${displayNum}`;
    }
    
    return {
      number: displayNum,
      originalText: d.originalText || d.cleanText || d.text_clean || d.text_with_svara || d.text || d.text_content || "",
      transliteration: d.transliteration || d.phonetic || d.roman || d.itx || "",
      translation: d.translation || d.english || ""
    };
  });
  
  // Segment-based natural comparison (version / chapter-verse sort)
  // Splits strings into numeric and non-numeric chunks and compares segment-by-segment.
  // This correctly sorts: "1.1" < "1.2" < "1.10" < "1.11" < "2.1"
  verses.sort((a, b) => {
    const chunkify = (str: string) => {
      return str.split(/(\d+)/).filter(Boolean);
    };
    
    const chunksA = chunkify(a.number);
    const chunksB = chunkify(b.number);
    
    const minLength = Math.min(chunksA.length, chunksB.length);
    for (let i = 0; i < minLength; i++) {
      const chunkA = chunksA[i];
      const chunkB = chunksB[i];
      
      const isNumA = /^\d+$/.test(chunkA);
      const isNumB = /^\d+$/.test(chunkB);
      
      if (isNumA && isNumB) {
        const diff = parseInt(chunkA, 10) - parseInt(chunkB, 10);
        if (diff !== 0) return diff;
      } else if (chunkA !== chunkB) {
        return chunkA.localeCompare(chunkB, undefined, { numeric: true, sensitivity: 'base' });
      }
    }
    
    return chunksA.length - chunksB.length;
  });
  
  return {
    introSummary: `Loaded Chapter/Section ${div} directly from your custom database 'interfaith-108' in Firestore.`,
    verses,
    commentary: `### Scholarly Commentary\n\nThis text was retrieved from your custom uploaded repository inside Firestore ('interfaith-108'). This ensures full accuracy, preserving the authentic verses, transliterations, and commentary you configured.`,
    interfaithParallels: [
      {
        religion: "Interfaith Insights",
        source: "Academy Ledger",
        similarity: "Matches with verified spiritual insights from world traditions.",
        lesson: "Always follow the path of truth, self-restraint, and devotion."
      }
    ]
  };
}

export interface MasterCanonBook {
  id: string;
  key: string;
  title: string;
  book_title?: string;
  religion: string;
  hierarchy_type: "flat" | "multi_tier" | "kandas_prashanas" | "chapters" | "standard" | string;
  description?: string;
  language?: string;
  branches?: string[];
  subCollectionsSchema?: string[];
  rawDocData?: any;
  docPath?: string;
  chapterCount?: number;
}

export interface CanonsControllerResult {
  allCanons: MasterCanonBook[];
  groupedByReligion: Record<string, MasterCanonBook[]>;
}

/**
 * Dynamic controller script for Interfaith Digital Library.
 * 1. Fetches master list of books from Firestore (interfaith-108).
 * 2. Groups books by their religion field to populate religion tabs.
 * 3. Aggregates all registered books into the 'All Canons' master tab.
 * 4. Reads hierarchy_type metadata ("flat", "multi_tier", "kandas_prashanas", "chapters", "standard")
 *    to determine rendering structure dynamically without skipping subcollections.
 */
export async function fetchMasterCanonsAndRoute(): Promise<CanonsControllerResult> {
  const allCanonsMap = new Map<string, MasterCanonBook>();
  const groupedByReligion: Record<string, MasterCanonBook[]> = {};

  const processDoc = (docId: string, data: any, pathContext?: string, relContext?: string) => {
    const rawReligion = (relContext || data.religion || data.category || "other").toLowerCase().trim();
    const title = data.title || data.book_title || data.name || docId;
    
    // Determine hierarchy_type from metadata or structure inference
    let hierarchyType: string = "chapters";
    if (data.hierarchy_type) {
      hierarchyType = String(data.hierarchy_type).toLowerCase().trim();
    } else if (data.has_branches || data.branches || docId.toLowerCase().includes("yajurveda") || data.kandas || data.sargas || data.prashanas) {
      hierarchyType = "kandas_prashanas";
    } else if (data.is_flat || data.has_single_collection) {
      hierarchyType = "flat";
    }

    const isYajurveda = docId.toLowerCase().includes("yajurveda") || title.toLowerCase().includes("yajurveda");
    const branches = data.branches || (isYajurveda ? ["Shukla", "Krishna"] : undefined);
    const subCollectionsSchema = data.subCollectionsSchema || (
      hierarchyType === "kandas_prashanas" || hierarchyType === "multi_tier"
        ? ["kandas", "prashanas", "verses"]
        : ["chapters", "verses"]
    );

    const canonBook: MasterCanonBook = {
      id: docId,
      key: docId.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      title,
      book_title: title,
      religion: rawReligion,
      hierarchy_type: hierarchyType,
      description: data.description || data.summary || `Sacred text canon: ${title}`,
      language: data.language || "Sanskrit / English",
      branches,
      subCollectionsSchema,
      rawDocData: data,
      docPath: pathContext || `books/${docId}`
    };

    allCanonsMap.set(docId, canonBook);

    if (!groupedByReligion[rawReligion]) {
      groupedByReligion[rawReligion] = [];
    }
    groupedByReligion[rawReligion].push(canonBook);
  };

  // 1. Fetch from 'books' collection
  try {
    const booksColRef = collection(db, "books");
    const booksSnap = await getDocs(booksColRef);
    booksSnap.forEach((docSnap) => {
      processDoc(docSnap.id, docSnap.data(), `books/${docSnap.id}`);
    });
  } catch (err) {
    console.warn("Notice: Could not fetch from 'books' collection directly:", err);
  }

  // 2. Fetch from 'Holy Scripture Books' top-level collection
  try {
    const holyBooksColRef = collection(db, "Holy Scripture Books");
    const holyBooksSnap = await getDocs(holyBooksColRef);
    holyBooksSnap.forEach((docSnap) => {
      if (!allCanonsMap.has(docSnap.id)) {
        processDoc(docSnap.id, docSnap.data(), `Holy Scripture Books/${docSnap.id}`);
      }
    });
  } catch (err) {
    console.warn("Notice: Could not fetch from 'Holy Scripture Books' collection directly:", err);
  }

  // 3. Scan known religion sub-paths under 'Holy Scripture Books'
  const knownReligions = ["Hinduism", "Islam", "Christianity", "Buddhism", "Judaism", "Sikhism", "Jainism", "Taoism", "Zoroastrianism", "Shinto", "Baha'i"];
  for (const relName of knownReligions) {
    try {
      const relColRef = collection(db, "Holy Scripture Books", relName, "books");
      const relSnap = await getDocs(relColRef);
      relSnap.forEach((docSnap) => {
        if (!allCanonsMap.has(docSnap.id)) {
          processDoc(docSnap.id, docSnap.data(), `Holy Scripture Books/${relName}/books/${docSnap.id}`, relName);
        }
      });
    } catch (e) {
      // Subcollection optional
    }
  }

  // Ensure Yajurveda & Mahapuranas default master canon entries exist if missing from Firestore
  if (!allCanonsMap.has("Yajurveda (यजुर्वेदः)") && !allCanonsMap.has("Yajurveda") && !allCanonsMap.has("yajurveda")) {
    processDoc("Yajurveda (यजुर्वेदः)", {
      title: "Yajurveda (यजुर्वेदः)",
      religion: "hinduism",
      hierarchy_type: "kandas_prashanas",
      branches: ["Shukla", "Krishna"],
      description: "Sacred Veda containing ritual mantras and prose formulas, divided into Shukla (White) and Krishna (Black) branches."
    });
  }

  if (!allCanonsMap.has("Mahapuranas (महापुराणाणि)") && !allCanonsMap.has("Mahapuranas") && !allCanonsMap.has("mahapuranas")) {
    processDoc("Mahapuranas (महापुराणाणि)", {
      title: "Mahapuranas (महापुराणाणि)",
      religion: "hinduism",
      hierarchy_type: "chapters",
      description: "Collection of 14 traditional Mahapuranas (including Bhagavata, Vishnu, Shiva, Brahma, Padma, Skanda, Agni, and others) detailing cosmology, legends, genealogies, and devotional philosophy."
    });
  }

  const allCanons = Array.from(allCanonsMap.values());

  return {
    allCanons,
    groupedByReligion
  };
}






