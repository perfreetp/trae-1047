import { create } from 'zustand';
import type { User } from '@/types';
import { mockUsers, currentUser as defaultUser } from '@/mock/users';

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  users: User[];
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: defaultUser,
  isLoggedIn: true,
  users: mockUsers,
  login: async (phone: string, _password: string) => {
    const foundUser = mockUsers.find((u) => u.phone === phone);
    if (foundUser) {
      set({ user: foundUser, isLoggedIn: true });
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, isLoggedIn: false });
    localStorage.removeItem('user');
  },
  setUser: (user: User) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  }
}));
