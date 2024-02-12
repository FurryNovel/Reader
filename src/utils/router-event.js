const eventMap = new Map();
let router = null;

function initRouterEvent(routerInstance) {
    router = routerInstance;
    if (import.meta.env.SSR) {
        router.afterEach((to, from) => {
            triggerRouteChange(to);
        });
    }
}

/**
 * @param {(to: any)=>void} callback
 *
 */
function onRouteChange(callback) {
    const to = router.currentRoute.value;
    eventMap.set(to.name, callback);
    onUnmounted(() => {
        eventMap.delete(to.name);
    });
    callback(to);
}

function triggerRouteChange(to) {
    let key = to?.name;
    if (!key) {
        return;
    }
    let callback = eventMap.get(key);
    callback && callback(to);
}


export {
    initRouterEvent,
    onRouteChange,
}
