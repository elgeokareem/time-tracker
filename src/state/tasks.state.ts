import create from 'zustand';
import type { ITasks } from '../types/types.types';

const prevState = JSON.parse(localStorage.getItem('tasks') || '[]');

// Global state
const useStoreTasks = create<ITasks>((set) => ({
  tasks: [...prevState],
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

export default useStoreTasks;
