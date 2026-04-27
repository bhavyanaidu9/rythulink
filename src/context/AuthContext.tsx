import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { getUserProfile, saveUserProfile, UserProfile } from '../services/firestoreService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result on mobile
    getRedirectResult(auth).then(async result => {
      if (result?.user) await ensureProfile(result.user);
    }).catch(() => {});

    const unsub = onAuthStateChanged(auth, async firebaseUser => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function ensureProfile(firebaseUser: User) {
    const existing = await getUserProfile(firebaseUser.uid);
    if (!existing) {
      await saveUserProfile(firebaseUser.uid, {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        role: null, language: 'en', profileComplete: false,
      });
    }
  }

  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await ensureProfile(result.user);
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') await signInWithRedirect(auth, googleProvider);
      else throw err;
    }
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  }

  async function refreshProfile() {
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
