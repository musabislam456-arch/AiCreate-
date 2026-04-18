import { create } from 'zustand';
import { supabase } from './supabase';

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
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string, avatarUrl: string) => Promise<void>;
  addComment: (text: string, rating: number) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  addHistory: (toolId: string, input: string, output: string) => Promise<void>;
  deleteHistory: (id: string) => Promise<void>;
  loadHistory: (userId: string) => Promise<void>;
  loadComments: () => Promise<void>;
  initialize: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  user: null,
  comments: [],
  history: [],
  isAuthReady: false,
  isLoginModalOpen: false,
  setIsLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),

  initialize: () => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        set({ 
          user: {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Creator',
            email: user.email || '',
            avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
            role: 'user'
          }
        });
        get().loadHistory(user.id);
      }
      set({ isAuthReady: true });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Creator',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            role: 'user'
          }
        });
        get().loadHistory(session.user.id);
      } else {
        set({ user: null, history: [] });
      }
    });

    get().loadComments();
  },

  loadHistory: async (userId: string) => {
    const { data } = await supabase
      .from('history')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    if (data) {
      set({ history: data as HistoryItem[] });
    }
  },

  loadComments: async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .order('createdAt', { ascending: false });
    if (data) {
      set({ comments: data as Comment[] });
    }
  },

  login: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw error;
  },

  loginWithEmail: async (email, pass) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) throw error;
  },

  signUpWithEmail: async (email, pass, name) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name,
        }
      }
    });
    if (error) throw error;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  updateProfile: async (name, avatarUrl) => {
    const { user } = get();
    if (!user) return;
    const { error } = await supabase.auth.updateUser({
      data: { name, avatar_url: avatarUrl }
    });
    if (!error) {
      set({ user: { ...user, name, avatar: avatarUrl } });
    }
  },

  addComment: async (text, rating) => {
    const { user, comments } = get();
    if (!user) return;
    const newComment = {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      rating,
      createdAt: Date.now()
    };
    
    // Optimistic UI
    set({ comments: [newComment as Comment, ...comments] });

    await supabase.from('comments').insert(newComment);
  },

  deleteComment: async (id) => {
    const { comments } = get();
    set({ comments: comments.filter(c => c.id !== id) });
    await supabase.from('comments').delete().eq('id', id);
  },

  addHistory: async (toolId, input, output) => {
    const { user, history } = get();
    if (!user) return;
    const newItem = {
      userId: user.id,
      toolId,
      input,
      output,
      createdAt: Date.now()
    };

    set({ history: [newItem as HistoryItem, ...history] });

    await supabase.from('history').insert(newItem);
  },

  deleteHistory: async (id) => {
    const { history } = get();
    set({ history: history.filter(h => h.id !== id) });
    await supabase.from('history').delete().eq('id', id);
  }
}));
