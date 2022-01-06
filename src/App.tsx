import { useEffect, useState } from "react";

// Components
import "react-clock/dist/Clock.css";
import Clock from "react-clock";
import Task from "./components/Task";
import Log from "./components/Log";
import Modal from "./components/Modal";

function App() {
  // Estados tareas
  const [tasks, setTasks] = useState(["Frico", "Crypto", "Personal", "Freelance", "Cursos"]);
  // Estados para el tiempo
  const initialDate = new Date(2000, 1, 1, 0, 0, 0, 0);
  const [time, setTime] = useState(initialDate);
  const [timePassed, setTimePassed] = useState("00:00");
  // Estados para el log
  const [log, setLog] = useState<any>([]);

  function addTask(task?: string) {
    setLog((oldLog: any) => {
      return [...oldLog, { task, time: timePassed }];
    });

    // Reset el tiempo
    setTime(initialDate);
    setTimePassed("0");
  }

  function summary() {
    // <div>Task: 00:00</div>
    const uniqueTasksTime = log.reduce((acc: any, curr: any) => {
      if (acc[curr.task]) {
        const [currHours, currMinutes] = curr.time.split(":");
        const [accHours, accMinutes] = acc[curr.task].split(":");
        let newHours = parseInt(currHours) + parseInt(accHours);
        let newMinutes = Number(currMinutes) + Number(accMinutes);
        if (newMinutes >= 60) {
          newHours += 1;
        }
        acc[curr.task] = `${newHours < 10 ? "0" : ""}${newHours}:${newMinutes < 10 ? "0" : ""}${newMinutes}`;
      } else {
        acc[curr.task] = curr.time;
      }
      return acc;
    }, {});

    // return uniqueTasksTime.map((item: any, index: number) => {
    //   <div key={index}>{item}</div>
    // })

    const uniqueKeys = Object.keys(uniqueTasksTime);
    return uniqueKeys.map((item: any, index: number) => {
      return (
        <div key={index} className="font-normal">
          <p>{item} {uniqueTasksTime[item]}</p>
        </div>
      );
    });
  }

  useEffect(() => {
    function addSeconds(date: Date, seconds: number) {
      const time = 1000 * seconds + date.getTime();
      return new Date(time);
    }

    function formatDate(diffInMiliseconds: number) {
      const hours = Math.floor(diffInMiliseconds / 1000 / 60 / 60);
      const minutes = Math.floor(
        (diffInMiliseconds / 1000 / 60 / 60 - hours) * 60
      );
      return `${hours < 10 ? "0" : ""}${hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}`;
    }

    const timeoutId = setTimeout(() => {
      const newDate = addSeconds(time, 1);
      const dateDifferenceInMiliseconds =
        newDate.getTime() - initialDate.getTime();
      setTimePassed(formatDate(dateDifferenceInMiliseconds));
      setTime(newDate);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [time]);

  return (
    <div className="h-[100vh] bg-[#283618] flex">
      {/* menu */}
      <aside className="w-1/4 py-4 pl-3 bg-[#fefae0] h-100">
        <button className="bg-[#f4a261] px-4 py-1 rounded-full mx-auto">
          Sesiones
        </button>
      </aside>

      {/* main */}
      <main className="flex flex-col items-center w-full pt-10">
        <h2 className="text-[#fefae0] text-4xl mb-6">Inicia Sesión seleccionando una Tarea</h2>
        <Clock value={time} />
        <div className="text-[#fefae0] font-bold">{timePassed}</div>
        <h1 className="text-[#fefae0] -mt-2">Tiempo en la tarea</h1>
        <div className="flex gap-5 mt-6">
          <button className="bg-[#dda15e] px-2 py-1 rounded-full text-[#fefae0] font-bold">
            Finalizar Sesion
          </button>
        </div>
        <div className="flex justify-center w-full gap-5 px-5 mt-5">
          {/* Izquierda */}
          <section className="w-2/5 max-h-[300px]">
            <h2 className="text-2xl text-[#fefae0] font-bold">Tareas</h2>
            {tasks.map((task: string, index: number) => (
              <Task key={index} onClick={addTask} task={task} />
            ))}
          </section>

          {/* Derecha */}
          <section className="w-2/5 max-h-[400px] overflow-auto">
            <h2 className="text-2xl text-[#fefae0] font-bold">
              Log de progreso
            </h2>
            {log.map((item: any, index: number) => (
              <Log key={index} task={item.task} time={item.time} />
            ))}
          </section>
        </div>

        <section className="text-[#fefae0] w-4/5 mt-3 font-bold">
          <h2 className="text-2xl">Total de la sesión</h2>
          {summary()}
        </section>
      </main>
    </div>
  );
}

export default App;
