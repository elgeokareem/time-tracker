import { useEffect, useState, useRef } from "react";

// Store
import useStoreTasks from "./state/tasks.state";
import useStoreSessions from "./state/sessions.state";

// Components
import Clock from "react-clock";
import Task from "./components/Task";
import Log from "./components/Log";
import Menu from "./components/Menu";
import AddTask from "./components/AddTask";
import SessionDetail from "./components/SessionDetail";
import { CSSTransition } from "react-transition-group";

// styles
import "./components/AddTask.css";
import "./components/SessionDetail.css";
import "react-clock/dist/Clock.css";

// Helpers
import { addSeconds, formatDate, saveSession } from "./helpers/utils.helpers";

// Types
import { ISessionObject } from "./types/types.types";

function App() {
  // Store
  const { tasks } = useStoreTasks(state => state);
  const { sessions, initSessionStore, addSessionStore } = useStoreSessions(
    state => state
  );
  // Task
  const [currentTask, setCurrentTask] = useState("");
  // Modals
  const [showModalTasks, setShowModalTasks] = useState(false);
  const [showModalDetailSession, setShowModalDetailSession] = useState(false);
  // Session Name
  const [sessionName, setSessionName] = useState("");
  const [sessionData, setSessionData] = useState<ISessionObject>({
    name: "",
    date: "",
    details: [{ task: "", time: "" }]
  });
  // Estados para el tiempo
  const initialDate = new Date(2000, 1, 1, 0, 0, 0, 0);
  const [time, setTime] = useState(initialDate);
  const [timePassed, setTimePassed] = useState("00:00");
  const [continueTimer, setContinueTimer] = useState(false);
  // Estados para el log
  const [log, setLog] = useState<Array<{ task: string; time: string }>>([]);
  // Refs para quitar errores en react transition group
  const addTaskRef = useRef(null);
  const sessionDetailRef = useRef(null);

  function addTaskToLog(task: string) {
    if (timePassed !== "00:00") {
      setLog((oldLog: any) => {
        return [...oldLog, { task: currentTask, time: timePassed }];
      });
    }

    setContinueTimer(true);
    setCurrentTask(task);

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
        acc[curr.task] = `${newHours < 10 ? "0" : ""}${newHours}:${
          newMinutes < 10 ? "0" : ""
        }${newMinutes}`;
      } else {
        acc[curr.task] = curr.time;
      }
      return acc;
    }, {});

    const uniqueKeys = Object.keys(uniqueTasksTime);
    return uniqueKeys.map((item: any, index: number) => {
      return (
        <div key={index} className="font-normal">
          <p>
            {item} {uniqueTasksTime[item]}
          </p>
        </div>
      );
    });
  }

  useEffect(() => {
    initSessionStore();
  }, []);

  useEffect(() => {
    if (continueTimer) {
      const timeoutId = setInterval(() => {
        const newDate = addSeconds(time, 1);
        const dateDifferenceInMiliseconds =
          newDate.getTime() - initialDate.getTime();
        setTimePassed(formatDate(dateDifferenceInMiliseconds));
        setTime(newDate);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [time, continueTimer]);

  return (
    <div className="h-[100vh] bg-[#283618] flex relative">
      {/* menu */}
      <Menu
        changeModalTasks={setShowModalTasks}
        changeModalSessionDetails={setShowModalDetailSession}
        setSessionDetails={setSessionData}
      />
      <CSSTransition
        in={showModalTasks}
        timeout={300}
        classNames="tasks"
        unmountOnExit
        nodeRef={addTaskRef}
      >
        <AddTask changeModal={setShowModalTasks} ref={addTaskRef} />
      </CSSTransition>

      <CSSTransition
        in={showModalDetailSession}
        timeout={300}
        classNames="session-details"
        unmountOnExit
        nodeRef={sessionDetailRef}
      >
        <SessionDetail
          sessionData={sessionData}
          setModal={setShowModalDetailSession}
          ref={sessionDetailRef}
        />
      </CSSTransition>

      {/* main */}
      <main className="flex flex-col items-center w-full pt-10">
        {currentTask === "" ? (
          <h2 className="text-[#fefae0] text-4xl mb-6">
            Inicia Sesión seleccionando una Tarea
          </h2>
        ) : (
          <h2 className="text-[#fefae0] text-4xl mb-6">{currentTask}</h2>
        )}
        <Clock value={time} />
        <div className="text-[#fefae0] font-bold">{timePassed}</div>
        <h1 className="text-[#fefae0] -mt-2">Tiempo en la tarea</h1>
        <input
          type="text"
          placeholder="Nombre Sesión"
          value={sessionName}
          className="px-2 py-1 text-[#333] border border-[#dda15e] rounded-lg focus:outline-none focus:shadow-outline"
          onChange={e => setSessionName(e.target.value)}
        />
        <div className="flex gap-5 mt-6">
          <button
            className="bg-[#dda15e] px-2 py-1 rounded-full text-[#fefae0] font-bold"
            onClick={() => {
              setContinueTimer(true);
            }}
          >
            Reanudar
          </button>
          <button
            className="bg-[#dda15e] px-2 py-1 rounded-full text-[#fefae0] font-bold"
            onClick={() => setContinueTimer(false)}
          >
            Pausa
          </button>
          <button
            className="bg-[#dda15e] px-2 py-1 rounded-full text-[#fefae0] font-bold"
            onClick={() => {
              saveSession(
                [...log, { task: currentTask, time: timePassed }],
                addSessionStore,
                sessionName
              );
              setTime(initialDate);
              setTimePassed("0");
              setCurrentTask("");
              setContinueTimer(false);
              setLog([]);
              setSessionName("");
            }}
          >
            Finalizar Sesion
          </button>
        </div>
        <div className="flex justify-center w-full gap-5 px-5 mt-5">
          {/* Izquierda */}
          <section className="w-2/5 max-h-[300px]">
            <h2 className="text-2xl text-[#fefae0] font-bold">Actividades</h2>
            {tasks.map((task: string, index: number) => (
              <Task key={index} onClick={addTaskToLog} task={task} />
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
