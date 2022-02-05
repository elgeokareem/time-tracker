export default function Task({ task, onClick }: { task: string, onClick: (task: string) => void }) {
  return (
    <div className="flex items-center my-4 w-full px-2 py-1 rounded-full border border-[#dda15e] text-[#fefae0] text-xs gap-5">
      <img src="https://picsum.photos/25" alt="" className="rounded-full" />
      <p className="text-lg font-bold">{task}</p>
      <button className="bg-[#dda15e] px-2 py-1 rounded-full ml-auto" onClick={() => onClick(task)}>Iniciar Tarea</button>
    </div>
  )
}
