import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, doc } from 'firebase/firestore'

export const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_APP_MEASUREMENT_ID
})

const db = 'users'
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const firestore = getFirestore(app)

export const signIn = async () => signInWithPopup(auth, provider)
export const docRef = (id: string) => doc(firestore, db, id)

export interface CreatedAt {
  nanoseconds: number
  seconds: number
}

export interface PasswordList {
  createdAt: CreatedAt
  password: string
  title: string
}

export interface AppDocumentData {
  createdAt: CreatedAt
  email: string
  passwordList: PasswordList[]
}
