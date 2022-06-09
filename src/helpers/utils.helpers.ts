import type { ISessionObject } from "../types/types.types";

export function addSeconds(date: Date, seconds: number) {
  const time = 1000 * seconds + date.getTime();
  return new Date(time);
}

export function formatDate(diffInMiliseconds: number) {
  const hours = Math.floor(diffInMiliseconds / 1000 / 60 / 60);
  const minutes = Math.floor((diffInMiliseconds / 1000 / 60 / 60 - hours) * 60);
  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}

// create function that returns date in format:
// "dd.mm.yyyy"
export function formatDateToString(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? "0" : ""}${day}/${
    month < 10 ? "0" : ""
  }${month}/${year}`;
}

export function saveSession(
  logs: Array<{ task: string; time: string }>,
  addToDB: any,
  sessionName: string
) {
  const session = {
    name: sessionName,
    date: formatDateToString(new Date()),
    details: logs
  };
  addToDB(session);
}

export function findSession(sessions: ISessionObject[], nameSession: string) {
  const currentSession = sessions.find(
    item => item.name === nameSession
  ) as ISessionObject;

  return currentSession;
}

export function sumTime(timeArray: string[]) {
  let totalTimeInHours = 0;

  for (let i = 0; i < timeArray.length; i++) {
    const time = timeArray[i];
    const [hours, minutes] = time.split(":");
    totalTimeInHours += parseInt(hours, 10) + parseInt(minutes, 10) / 60;
  }

  const hoursInMinutes = totalTimeInHours * 60;
  const hoursInHours = Math.floor(hoursInMinutes / 60);
  const minutes = hoursInMinutes % 60;
  if (hoursInHours === 0) {
    return `${minutes} minutos`;
  }
  return `${hoursInHours}:${minutes}`;
}

export function reverseArray(arr: any[]) {
  const reversedArray: any[] = [];
  const newArrStr = JSON.stringify(arr);
  const newArr = JSON.parse(newArrStr);

  for (let i = newArr.length - 1; i >= 0; i--) {
    reversedArray.push(newArr[i]);
  }
  return reversedArray;
}
