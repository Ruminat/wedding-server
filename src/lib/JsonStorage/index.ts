import { throttle } from "lodash";
import { readFileSync, writeToFile } from "../FS/utils";

const abortController = new AbortController();

export function createJsonStorage<T>(params: { filePath: string; defaultValue: T; delay?: number }) {
  const { filePath, defaultValue } = params;

  const savedValue = readFileSync(filePath);
  let currentValue: T = savedValue ? JSON.parse(savedValue) : defaultValue;

  const get = () => currentValue;

  const actualWrite = throttle(
    () => writeToFile(filePath, JSON.stringify(get()), abortController),
    params.delay ?? 3000
  );

  const update = (updateFn: (old: T) => T) => {
    currentValue = updateFn(get());
    actualWrite();
  };

  const reset = () => update(() => defaultValue);

  return { get, update, reset };
}
