/* ==========================================================================
   SV TEXTILES — Firebase Configuration & Demo Mode Detection
   
   Instructions for Production Deployment:
   1. Create a Firebase project at https://console.firebase.google.com
   2. Enable Authentication (Email/Password), Cloud Firestore, and Firebase Storage
   3. Replace the placeholder values in `FIREBASE_CONFIG` below with your public
      Firebase web app config credentials.
   4. Note: Frontend Firebase API keys are public client identifiers. Never place
      private service account JSON or Firebase Admin SDK private keys in frontend files!
   5. If FIREBASE_CONFIG remains with placeholder values, SV TEXTILES automatically
      and seamlessly activates the interactive Demo Mode (Offline Local Storage),
      clearly indicating this to users.
   ========================================================================== */

const FIREBASE_CONFIG = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "sv-textiles-demo.firebaseapp.com",
  projectId: "sv-textiles-demo",
  storageBucket: "sv-textiles-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Check whether real Firebase config is provided
function isFirebaseConfigured() {
  return (
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.apiKey !== "YOUR_FIREBASE_API_KEY_HERE" &&
    !FIREBASE_CONFIG.apiKey.startsWith("YOUR_")
  );
}

// Global Demo Mode status
window.SVT_DEMO_MODE = !isFirebaseConfigured();

console.log(
  `%c[SV TEXTILES] Mode: ${window.SVT_DEMO_MODE ? 'Interactive Demo Mode (LocalStorage Engine)' : 'Firebase Connected'}`,
  'color: #C6A15B; font-weight: bold; font-size: 13px;'
);
