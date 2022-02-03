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
