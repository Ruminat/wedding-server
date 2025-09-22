const isDev = process.env.development === "true";

export function logInfo(...content: unknown[]): void {
  if (!isDev) return;
  console.log(...content);
}
