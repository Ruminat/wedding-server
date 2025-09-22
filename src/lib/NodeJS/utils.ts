export function checkNodeFeatures() {
  const abortController = new AbortController();
  if (!abortController) {
    console.log("\n\n NO ABORT CONTROLLER — USE NEWER NODE JS VERSION \n\n");
  }

  if (!global.fetch) {
    console.log("\n\n NO FETCH — USE NEWER NODE JS VERSION \n\n");
  }
}
