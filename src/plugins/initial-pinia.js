export function initialPinia({options, store}) {
    if (options.id === 'server-side-render') {
        if (window.__INITIAL_STATE__){
            store.$state = window.__INITIAL_STATE__;
        }
    }
}
