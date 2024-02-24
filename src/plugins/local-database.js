import localForage from "localforage";

import {useNovelStore} from "@/stores/novels.js";
import {useSettingStore} from "@/stores/settings.js";
import {useBookmarkStore} from "@/stores/bookmarks.js";
import {useHistoryStore} from "@/stores/histories.js";


export async function localDatabase({options, store}) {
    if (!(options?.persist)) {
        return;
    }
    const instance = localForage.createInstance({
        name: store.$id,
        driver: localForage.INDEXEDDB,
    })
    store.driver = instance;
    store.options = options;
    let patches = {};
    const task = instance.keys().then((keys) => {
        if (options.lazy) {
            return;
        }
        return Promise.all(keys.map(key => instance.getItem(key).then((value) => {
            patches[key] = value.value;
        })));
    });
    
    return task.then(() => {
        if ('expire' in patches) {
            if (patches.expire && patches.expire < Date.now()) {
                patches = {};
            }
        }
        Object.keys(patches).forEach((key) => {
            if (key === 'expire') {
                return;
            }
            if (typeof patches[key] == 'object' && !Array.isArray(patches[key])) {
                patches[key] = Object.assign({}, {
                    ...(store?.$state[key] || {})
                }, patches[key]);
            }
        });
        store.$patch(patches);
    }).catch((err) => {
    }).finally(() => {
        store.$subscribe((mutation, state) => {
            let saveMode = 0;
            //payload
            if (mutation.events) {
                if (mutation.events.key in state) {
                    if (state[mutation.events.key] !== undefined && typeof state[mutation.events.key] !== 'function') {
                        instance.setItem(
                            mutation.events.key,
                            {
                                value: JSON.parse(JSON.stringify(state[mutation.events.key])),
                                time: Date.now(),
                            },
                        );
                    }
                } else {
                    saveMode = 1;
                }
            } else if (mutation.payload) {
                for (const key of Object.keys(mutation.payload)) {
                    if (mutation.payload[key] === undefined || typeof mutation.payload[key] === 'function') {
                        continue;
                    }
                    instance.setItem(
                        key,
                        {
                            value: JSON.parse(JSON.stringify(mutation.payload[key])),
                            time: Date.now(),
                        },
                    );
                }
            } else {
                saveMode = 1;
            }
            if (saveMode) {
                for (const key of Object.keys(state)) {
                    if (state[key] === undefined || typeof state[key] === 'function') {
                        continue;
                    }
                    instance.setItem(
                        key,
                        {
                            value: JSON.parse(JSON.stringify(state[key])),
                            time: Date.now(),
                        },
                    );
                }
            }
        })
    });
}

const globalInstall = [
    {sync: true, install: useSettingStore},
    {sync: false, install: useNovelStore},
    {sync: false, install: useBookmarkStore},
    {sync: false, install: useHistoryStore},
];

export function createRecoveryStorePlugin() {
    return Promise.all(globalInstall.map((installer) => {
        return new Promise((resolve, reject) => {
            const store = installer.install();
            if (installer.sync) {
                const unSubscribe = store.$subscribe((mutation, state) => {
                    unSubscribe();
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }));
}
