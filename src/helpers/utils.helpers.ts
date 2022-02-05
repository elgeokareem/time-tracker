export function addSeconds(date: Date, seconds: number) {
  const time = 1000 * seconds + date.getTime();
  return new Date(time);
}

export function formatDate(diffInMiliseconds: number) {
  const hours = Math.floor(diffInMiliseconds / 1000 / 60 / 60);
  const minutes = Math.floor(
    (diffInMiliseconds / 1000 / 60 / 60 - hours) * 60
  );
  return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
}

// create function that returns date in format:
// "dd.mm.yyyy"
export function formatDateToString(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? "0" : ""}${day}.${month < 10 ? "0" : ""}${month}.${year}`;
}

export function saveSession(
  logs: Array<{task: string; time: string}>, addToDB: any
  ) {
  const session = {
    date: formatDateToString(new Date()),
    details: logs,
  };
  addToDB(session);
}
