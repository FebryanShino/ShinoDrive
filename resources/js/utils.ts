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
