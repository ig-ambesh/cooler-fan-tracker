import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCQcZGwkvELODdYpYy8JHtbmvkAHgSOU7M",
  authDomain: "cooler-fan-track.firebaseapp.com",
  projectId: "cooler-fan-track",
  storageBucket: "cooler-fan-track.firebasestorage.app",
  messagingSenderId: "82905607300",
  appId: "1:82905607300:web:aeea897e8fd0559db726d1",
  measurementId: "G-V76BB3K4LP"
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
