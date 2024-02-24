import worker from "./../dist/server/worker.js";

export async function onRequest(context) {
    return worker.fetch(context.request);
}
