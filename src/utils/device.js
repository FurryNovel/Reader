export const isMobile = ref(false);

export function initDeviceEvent() {
    const media = window.matchMedia('not all and (min-width: 640px)');
    media.removeEventListener('change', onSize);
    media.addEventListener('change', onSize);
    onSize(media);
}

const onSize = (e) => {
    isMobile.value = e.matches;
    console.log('isMobile', isMobile.value);
};

export function useDeviceInfo() {
    return computed(() => {
        return {
            isMobile: isMobile.value,
        }
    })
}
