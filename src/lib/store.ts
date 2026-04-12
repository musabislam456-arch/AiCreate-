import { create } from 'zustand';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  rating: number;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  userId: string;
  toolId: string;
  input: string;
  output: string;
  createdAt: number;
}

interface AppState {
  user: User | null;
  comments: Comment[];
  history: HistoryItem[];
  isAuthReady: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, avatarUrl: string) => Promise<void>;
  addComment: (text: string, rating: number) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  addHistory: (toolId: string, input: string, output: string) => Promise<void>;
  deleteHistory: (id: string) => Promise<void>;
  initialize: () => void;
}

let unsubscribeHistory: (() => void) | null = null;

export const useAppStore = create<AppState>()((set, get) => ({
  user: null,
  comments: [],
  history: [],
  isAuthReady: false,

  initialize: () => {
    // Auth Listener
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'id'>;
            set({ user: { id: firebaseUser.uid, ...userData } });
          } else {
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Creator',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              role: 'user'
            };
            await setDoc(userDocRef, {
              name: newUser.name,
              email: newUser.email,
              avatar: newUser.avatar,
              role: newUser.role
            });
            set({ user: newUser });
          }

          // Initialize History Listener for this user
          if (unsubscribeHistory) unsubscribeHistory();
          const historyQuery = query(
            collection(db, 'history'), 
            where('userId', '==', firebaseUser.uid),
            orderBy('createdAt', 'desc')
          );
          unsubscribeHistory = onSnapshot(historyQuery, (snapshot) => {
            const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryItem));
            set({ history });
          }, (error) => {
            handleFirestoreError(error, OperationType.LIST, 'history');
          });

        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        set({ user: null, history: [] });
        if (unsubscribeHistory) {
          unsubscribeHistory();
          unsubscribeHistory = null;
        }
      }
      set({ isAuthReady: true });
    });

    // Comments Listener (Public)
    const commentsQuery = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    onSnapshot(commentsQuery, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
      set({ comments });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'comments');
    });
  },

  login: async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },

  updateProfile: async (name, avatarUrl) => {
    const { user } = get();
    if (!user) return;
    const userDocRef = doc(db, 'users', user.id);
    try {
      await setDoc(userDocRef, { name, avatar: avatarUrl }, { merge: true });
      set({ user: { ...user, name, avatar: avatarUrl } });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.id}`);
    }
  },

  addComment: async (text, rating) => {
    const { user } = get();
    if (!user) return;
    try {
      await addDoc(collection(db, 'comments'), {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        text,
        rating,
        createdAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'comments');
    }
  },

  deleteComment: async (id) => {
    try {
      await deleteDoc(doc(db, 'comments', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `comments/${id}`);
    }
  },

  addHistory: async (toolId, input, output) => {
    const { user } = get();
    if (!user) return;
    try {
      await addDoc(collection(db, 'history'), {
        userId: user.id,
        toolId,
        input,
        output,
        createdAt: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'history');
    }
  },

  deleteHistory: async (id) => {
    try {
      await deleteDoc(doc(db, 'history', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `history/${id}`);
    }
  }
}));
