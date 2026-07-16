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

/**
 * Dynamic Firestore Scripture Loader
 * Checks if the user uploaded canonical scriptures (like Bhagavad Gita or Rigveda)
 * into their Firestore database under 'scriptures/{bookKey}/verses' or 'verses'.
 * If found, displays them instead of calling the Gemini generator.
 */
export async function fetchScriptureFromFirestore(
  bookKey: string,
  divisionNumber: number
): Promise<any | null> {
  try {
    const k = bookKey.toLowerCase();
    const div = Number(divisionNumber);
    
    // Check subcollection scriptures/{bookKey}/verses
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

function formatFirestoreVerses(docs: any[], div: number, bookKey: string) {
  const verses = docs.map((docSnap) => {
    const d = docSnap.data();
    
    let verseNum = d.verse || d.number || d.verse_num || d.id || docSnap.id;
    if (typeof verseNum === "string" && verseNum.includes(".")) {
      const parts = verseNum.split(".");
      verseNum = parts[parts.length - 1];
    }
    
    return {
      number: String(verseNum),
      originalText: d.originalText || d.cleanText || d.text_clean || d.text_with_svara || d.text || "",
      transliteration: d.transliteration || d.phonetic || d.roman || "",
      translation: d.translation || ""
    };
  });
  
  verses.sort((a, b) => {
    const numA = parseInt(a.number.replace(/\D/g, ""), 10) || 0;
    const numB = parseInt(b.number.replace(/\D/g, ""), 10) || 0;
    return numA - numB;
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





