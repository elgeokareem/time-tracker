// Interface
export interface ITasks {
  tasks: Array<string>;
  addTaskStore: (task: string) => void;
  removeTaskStore: (task: string) => void;
}

export interface ISessions {
  sessions: Array<ISessionObject>;
  initSessionStore: () => Promise<void>;
  addSessionStore: (session: ISessionObject) => void;
}

export interface ISessionObject {
  name: string;
  date: string;
  details: Array<{ task: string; time: string }>;
}
