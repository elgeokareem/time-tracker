import { useEffect, useState } from "react";
import useStore from "../state/globalState";

export default function AddTask({ changeModal }: { changeModal: any }) {
  const { tasks, addTaskStore, removeTaskStore } = useStore((state) => state);
  const [task, setTask] = useState("");

  useEffect(() => {}, [setTask]);

  return (
    <aside className="w-1/4 max-w-[300px] flex-none py-4 px-3 bg-[#fefae0] h-[100vh] absolute flex flex-col">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 ml-auto text-2xl cursor-pointer"
        viewBox="0 0 20 20"
        fill="currentColor"
        onClick={() => changeModal(false)}
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>

      <h2 className="text-2xl">Añadir y editar tareas</h2>

      <div className="flex items-center mt-5 cursor-pointer">
        <input
          type="text"
          value={task}
          className="px-2 py-1 border border-gray-500 rounded-lg"
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTaskStore(task);
              setTask("");
            }
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 ml-3"
          viewBox="0 0 20 20"
          fill="currentColor"
          onClick={() => {
            addTaskStore(task);
          }}
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        {tasks.map((task: string, index: number) => (
          <div key={index} className="flex justify-between mt-5">
            {task}

            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => removeTaskStore(task)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
