import create from 'zustand';

interface ITypes {
  tasks: Array<string>;
  addTaskStore: (task: string) => void;
  removeTaskStore: (task: string) => void;
}

const prevState = JSON.parse(localStorage.getItem('tasks') || '[]');

// Global state
const useStore = create<ITypes>((set) => ({
  tasks: [prevState],
  addTaskStore: (newTask) => set(state => {
    const newTasks = [...state.tasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    return { tasks: newTasks };
  }),
  removeTaskStore: (toRemoveTask) => set(state => {
    const newTasks = state.tasks.filter(task => task !== toRemoveTask);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    return { tasks: newTasks };
  }),
}))

export default useStore;
