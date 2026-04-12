import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
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
  toolId: string;
  input: string;
  output: string;
  createdAt: number;
}

interface AppState {
  user: User | null;
  comments: Comment[];
  history: HistoryItem[];
  login: (name: string, email: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => void;
  updateProfile: (name: string, avatarUrl: string) => void;
  addComment: (text: string, rating: number) => void;
  deleteComment: (id: string) => void;
  addHistory: (toolId: string, input: string, output: string) => void;
  deleteHistory: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      comments: [
        {
          id: '1',
          userId: 'system',
          userName: 'Sarah (Creator)',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          text: 'This platform is a lifesaver! The viral hook generator completely changed my TikTok strategy.',
          rating: 5,
          createdAt: Date.now() - 86400000,
        },
        {
          id: '2',
          userId: 'system2',
          userName: 'MikeTech',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          text: 'The SEO title generator is insanely good. Finally hitting the algorithm right.',
          rating: 4,
          createdAt: Date.now() - 3600000,
        }
      ],
      history: [],
      
      login: (name, email) => {
        const newUser = {
          id: Math.random().toString(36).substring(7),
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };
        set({ user: newUser });
      },

      signup: (name, email) => {
        const newUser = {
          id: Math.random().toString(36).substring(7),
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };
        set({ user: newUser });
      },
      
      logout: () => set({ user: null }),

      updateAvatar: (avatarUrl) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, avatar: avatarUrl }
          };
        });
      },

      updateProfile: (name, avatarUrl) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, name, avatar: avatarUrl }
          };
        });
      },
      
      addComment: (text, rating) => {
        const { user } = get();
        if (!user) return;
        
        const newComment: Comment = {
          id: Math.random().toString(36).substring(7),
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          text,
          rating,
          createdAt: Date.now(),
        };
        
        set((state) => ({ comments: [newComment, ...state.comments] }));
      },

      deleteComment: (id) => {
        set((state) => ({
          comments: state.comments.filter(c => c.id !== id)
        }));
      },
      
      addHistory: (toolId, input, output) => {
        const { user } = get();
        if (!user) return; // Only save history if logged in
        
        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(7),
          toolId,
          input,
          output,
          createdAt: Date.now(),
        };
        
        set((state) => ({ history: [newItem, ...state.history] }));
      },

      deleteHistory: (id) => {
        set((state) => ({
          history: state.history.filter(h => h.id !== id)
        }));
      }
    }),
    {
      name: 'creator-tools-storage',
    }
  )
);
