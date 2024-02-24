export async function onRequest(context) {
    return worker.fetch(context.request);
}
