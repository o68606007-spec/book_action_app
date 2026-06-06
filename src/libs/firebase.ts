import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1Yq6qPHatTfGilhuKkynNphiHFDNrsls",
  authDomain: "bookactionapp-3b704.firebaseapp.com",
  projectId: "bookactionapp-3b704",
  storageBucket: "bookactionapp-3b704.firebasestorage.app",
  messagingSenderId: "610447904328",
  appId: "1:610447904328:web:6fe73849f2b9d641e7127d",
  measurementId: "G-EK2H6BQP7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
// console.log(analytics);
export { analytics, auth };
// export default auth;
