import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { GoogleAuth } from "google-auth-library";

async function runAuthDiagnostics() {
  console.log("\n==============================================");
  console.log("    Firebase Admin SDK ADC Auth Diagnostics   ");
  console.log("==============================================\n");

  try {
    // 1. Initialize Google Auth to verify environment-level project resolution
    const auth = new GoogleAuth();
    let projectId = "Unknown";
    try {
      projectId = await auth.getProjectId();
      console.log(`✅ GoogleAuth: Successfully resolved Project ID: "${projectId}"`);
    } catch (err: any) {
      console.error(`❌ GoogleAuth: Failed to resolve Project ID: ${err.message}`);
    }

    // 2. Initialize the Firebase Admin SDK using Application Default Credentials (ADC)
    let app;
    try {
      const apps = getApps();
      if (apps.length === 0) {
        app = initializeApp({
          credential: applicationDefault()
        });
        console.log("✅ Firebase Admin: Successfully initialized using Application Default Credentials (ADC)!");
      } else {
        app = apps[0];
        console.log("ℹ️ Firebase Admin: App was already initialized.");
      }
    } catch (err: any) {
      console.error(`❌ Firebase Admin: Failed to initialize Admin App: ${err.message}`);
    }

    // 3. Resolve the Auth Domain based on the project identity or FIREBASE_CONFIG
    let authDomain = `${projectId}.firebaseapp.com`;
    if (process.env.FIREBASE_CONFIG) {
      try {
        const parsedConfig = JSON.parse(process.env.FIREBASE_CONFIG);
        if (parsedConfig.authDomain) {
          authDomain = parsedConfig.authDomain;
        }
      } catch (e) {
        // Fall back to standard project-id based auth domain
      }
    }
    console.log(`✅ Auth Domain: Resolved to "${authDomain}"`);

    // 4. Retrieve credential client details
    try {
      const client = await auth.getClient();
      console.log(`✅ Credentials Source Client: ${client.constructor.name || typeof client}`);
    } catch (err: any) {
      console.warn(`⚠️ Credentials Source warning: ${err.message}`);
    }

    // 5. Relevant environment values
    console.log("\n=== Environmental Variables Context ===");
    console.log(`  GOOGLE_APPLICATION_CREDENTIALS : ${process.env.GOOGLE_APPLICATION_CREDENTIALS || "Not set"}`);
    console.log(`  GOOGLE_CLOUD_PROJECT           : ${process.env.GOOGLE_CLOUD_PROJECT || "Not set"}`);
    console.log(`  GCLOUD_PROJECT                 : ${process.env.GCLOUD_PROJECT || "Not set"}`);
    console.log(`  FIREBASE_CONFIG                : ${process.env.FIREBASE_CONFIG ? "Present" : "Not set"}`);
    console.log(`  K_SERVICE (Cloud Run Service)  : ${process.env.K_SERVICE || "Not set (Running locally/sandbox)"}`);
    console.log("==============================================\n");

  } catch (error: any) {
    console.error("❌ Debug Auth script encountered an error:", error.message);
  }
}

runAuthDiagnostics();
