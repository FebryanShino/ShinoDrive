export function cleanUrl(url: string): string {
  return url.replace(/^.*?(\/cosers)/, `/storage$1`);
}

export function uniqueArrayOfObjects<T>(data: T[], key: string): T[] {
  const seen = new Set();
  return data.filter((item: any) => {
    if (seen.has(item[key])) return false;
    seen.add(item[key]);
    return true;
  });
}

export function convertSecondsToTimeString(time: number = 0): string {
  const addZero = (num: string) => (num.length > 1 ? num : `0${num}`);
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${addZero(String(minutes))}:${addZero(String(seconds))}`;
}
