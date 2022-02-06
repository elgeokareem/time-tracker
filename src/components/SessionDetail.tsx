import { sumTime } from "../helpers/utils.helpers";
import type { ISessionObject } from "../types/types.types"

export default function SessionDetail({sessionData, setModal}: {
  sessionData: ISessionObject,
  setModal: React.Dispatch<React.SetStateAction<boolean>>
}
  ) {
  const timeEachTask = sessionData.details.map((item) => item.time);

  return (
    <aside className="w-1/4 max-w-[300px] flex-none py-4 px-3 bg-[#fefae0] h-[100vh] absolute flex flex-col">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 ml-auto text-2xl cursor-pointer"
        viewBox="0 0 20 20"
        fill="currentColor"
        onClick={() => setModal(false)}
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>

      <div className="text-[#444] text-2xl text-center">{sessionData.name}</div>
      <div className="text-[#444] text-center mb-6">Total: {sumTime(timeEachTask)}</div>

      {sessionData.details.map(item => {
        return (
          <div className="flex justify-between text-[#555]">
            <div>{item.task}</div>
            <div>{item.time}</div>
          </div>
        )
      })}
    </aside>
  );
}