import mitt from 'mitt';

const emitter = mitt();

export default {
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
    once(type, handler) {
        const _handler = (...args) => {
            handler(...args);
            emitter.off(type, _handler);
        };
        emitter.on(type, _handler);
    },
};
