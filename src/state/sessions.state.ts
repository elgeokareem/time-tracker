import create from 'zustand';
import localForage from "localforage";
import type { ISessions } from '../types/types.types';

const useStoreSessions = create<ISessions>((set) => ({
  sessions: [],
  initSessionStore: async () => {
    const prevState = await localForage.getItem('sessions') as ISessions["sessions"];
    set(state => {
      return { sessions: prevState ?? [] };
    });
  },
  addSessionStore: async (session) => {
    set((state) => {
      const newSessions = [...state.sessions, session];
      localForage.setItem('sessions', newSessions);
      return {
        sessions: newSessions
      };
    });
  },
}))

export default useStoreSessions;
