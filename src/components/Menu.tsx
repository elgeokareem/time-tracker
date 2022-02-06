import useStoreSessions from "../state/sessions.state"
import { findSession } from "../helpers/utils.helpers";

import type { ISessionObject } from "../types/types.types";

export default function Menu(
  {
    changeModalTasks,
    changeModalSessionDetails,
    setSessionDetails,
  }: {
    changeModalTasks: React.Dispatch<React.SetStateAction<boolean>>,
    changeModalSessionDetails: React.Dispatch<React.SetStateAction<boolean>>,
    setSessionDetails: any
  }) {
  const { sessions } = useStoreSessions((state) => state);
  return (
    <aside className="w-1/4 max-w-[300px] py-4 px-3 bg-[#fefae0] h-100 flex-none flex flex-col">
        <button
          className="bg-[#f4a261] text-[#333] px-4 py-1 rounded-full mx-auto"
          onClick={() => changeModalTasks(true)}
        >
          Añadir/Quitar tarea
        </button>
        
        <span className="mt-5 text-2xl text-[#555] font-bold">Sesiones</span>

        <div className="flex flex-col mt-3 text-xl">
          {sessions.map((item, counter) => (
            <button
              key={counter}
              className="bg-[#dda15e] mb-2 px-2 py-1 rounded-full text-[#fefae0] font-bold text-xl"
              onClick={() => {
                setSessionDetails(findSession(sessions, item.name));
                changeModalSessionDetails(true);
              }}
            >
              {item.name} - {item.date}
            </button>
          ))}
        </div>
    </aside>
  )
}
