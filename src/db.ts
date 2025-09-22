import { databasePath } from "./lib/FS/utils";
import { createJsonStorage } from "./lib/JsonStorage";

export type TWeddingAnswer = {
  who: string;
  answer: string;
  at: number;
};

type TStorage = TWeddingAnswer[];

const $weddingAnswers = createJsonStorage<TStorage>({ filePath: databasePath("answers.json"), defaultValue: [] });

export function getWeddingAnswers() {
  return $weddingAnswers.get();
}

export function addWeddingAnswer(answer: TWeddingAnswer) {
  $weddingAnswers.update((old) => [...old, answer]);
}

export function clearWeddingAnswers() {
  $weddingAnswers.update(() => []);
}
