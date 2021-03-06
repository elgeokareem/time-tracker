import { useEffect, useState, useRef } from "react";
import * as workerTimers from "worker-timers";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

// PWA
import { useRegisterSW } from "virtual:pwa-register/react";

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
import { ToastContainer, toast } from "react-toastify";

// styles
import "./components/AddTask.css";
import "./components/SessionDetail.css";
import "react-clock/dist/Clock.css";
import "react-toastify/dist/ReactToastify.css";

// Helpers
import {
  addSeconds,
  formatDate,
  saveSession,
  reverseArray,
  sumTime
} from "./helpers/utils.helpers";

// Types
import { ISessionObject } from "./types/types.types";

function App() {
  // PWA
  const {
    offlineReady: [offlineReady, setOfflineReady]
  } = useRegisterSW({
    immediate: true,
    onRegisterError(error) {
      console.error("register error in App", error);
    }
  });

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
  // Session
  const [activeSession, setActiveSession] = useState(false);
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
  const [log, setLog] = useState<ISessionObject["details"]>([]);
  // Refs para quitar errores en react transition group
  const addTaskRef = useRef(null);
  const sessionDetailRef = useRef(null);

  function addTaskToLog(task: string) {
    setLog((oldLog: ISessionObject["details"]) => {
      if (oldLog.length) {
        oldLog[oldLog.length - 1].time = timePassed;
      }

      return [...oldLog, { task, time: timePassed }];
    });

    setContinueTimer(true);
    setCurrentTask(task);

    // Reset el tiempo
    setTime(initialDate);
    setTimePassed("00:00");
  }

  useEffect(() => {
    initSessionStore();
    setOfflineReady(() => true);
  }, []);

  function summary() {
    const uniqueTasksTime = log.reduce(
      (
        acc: Record<string, string>,
        curr: ISessionObject["details"][number]
      ) => {
        if (acc[curr.task]) {
          const [currHours, currMinutes] = curr.time.split(":");
          const [accHours, accMinutes] = acc[curr.task].split(":");
          let newHours = parseInt(currHours) + parseInt(accHours);
          let newMinutes = Number(currMinutes) + Number(accMinutes);
          if (newMinutes >= 60) {
            newHours += 1;
          }
          acc[curr.task] = `${newHours < 10 ? "00:00" : ""}${newHours}:${
            newMinutes < 10 ? "00:00" : ""
          }${newMinutes}`;
        } else {
          acc[curr.task] = curr.time;
        }
        return acc;
      },
      {}
    );

    const uniqueKeys = Object.keys(uniqueTasksTime);
    return uniqueKeys.map((item: any, index: number) => {
      if (index === 0) {
        return (
          <div key={index} className="font-normal">
            <p>
              {item} {timePassed}
            </p>
          </div>
        );
      }
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
    if (continueTimer) {
      const timeoutId = workerTimers.setTimeout(() => {
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
            Inicia Sesi??n seleccionando una Tarea
          </h2>
        ) : (
          <h2 className="text-[#fefae0] text-4xl mb-6">{currentTask}</h2>
        )}
        <Clock value={time} />
        <div className="text-[#fefae0] font-bold">{timePassed}</div>
        <h1 className="text-[#fefae0] -mt-2">Tiempo en la tarea</h1>
        <input
          type="text"
          placeholder="Nombre Sesi??n"
          value={sessionName}
          className="px-2 py-1 text-[#333] border border-[#dda15e] rounded-lg focus:outline-none focus:shadow-outline"
          onChange={e => setSessionName(e.target.value)}
        />
        <div className="flex gap-5 mt-6">
          <button
            className="bg-[#dda15e] px-2 py-1 rounded-full text-[#fefae0] font-bold"
            onClick={() => {
              if (activeSession) {
                setContinueTimer(true);
                return;
              }

              toast.info(`Inicia una sesi??n pulsando "Iniciar Tarea" ????`);
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
              if (!activeSession) {
                toast.error("Primero debe iniciar una sesi??n :)");
                return;
              }

              log[log.length - 1].time = timePassed;
              saveSession(log, addSessionStore, sessionName);
              setLog([]);
              setTime(initialDate);
              setCurrentTask("");
              setSessionName("");
              setTimePassed("00:00");
              setContinueTimer(false);
              setActiveSession(false);
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
              <Task
                key={index}
                addTaskToLog={addTaskToLog}
                task={task}
                setActiveSession={setActiveSession}
                sessionName={sessionName}
              />
            ))}
          </section>

          {/* Derecha */}
          <section className="w-2/5 max-h-[400px] overflow-auto">
            <h2 className="text-2xl text-[#fefae0] font-bold">
              Log de progreso
            </h2>
            {reverseArray(log).map(
              (item: ISessionObject["details"][0], index: number) => {
                if (index === 0) {
                  return (
                    <Log key={index} task={currentTask} time={timePassed} />
                  );
                }
                return <Log key={index} task={item.task} time={item.time} />;
              }
            )}
          </section>
        </div>

        <section className="text-[#fefae0] w-4/5 mt-3 font-bold">
          <h2 className="text-2xl">
            Total de la sesi??n:{" "}
            {sumTime(
              log.map((item, index) => {
                if (index === log.length - 1) {
                  return (log[log.length - 1].time = timePassed);
                }
                return item.time;
              })
            )}
          </h2>
          {summary()}
        </section>
      </main>

      <ToastContainer />
    </div>
  );
}

export default App;
