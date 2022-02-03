export default function Modal({ changeModal }: { changeModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <aside className="w-1/4 max-w-[300px] py-4 px-3 bg-[#fefae0] h-100 flex-none flex flex-col">
        <button
          className="bg-[#f4a261] px-4 py-1 rounded-full mx-auto"
          onClick={() => changeModal(true)}
        >
          Añadir/Quitar tarea
        </button>
        
        <span className="mt-5 text-2xl text-[#555] font-bold">Sesiones</span>

        <div className="flex flex-col mt-3 text-xl"></div>
    </aside>
  )
}
