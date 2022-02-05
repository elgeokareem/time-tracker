import create from 'zustand';
import localForage from "localforage";
import type { ISessions } from '../types/types.types';

const useStoreSessions = create<ISessions>((set) => ({
  session: [],
  initSessionStore: async () => {
    const prevState = await localForage.getItem('sessions') as ISessions["session"];
    set(state => {
      return { session: prevState ?? [] };
    });
  },
  addSessionStore: async (session) => {
    set((state) => {
      const newSessions = [...state.session, session];
      localForage.setItem('sessions', newSessions);
      return {
        session: newSessions
      };
    });
  },
}))

export default useStoreSessions;
