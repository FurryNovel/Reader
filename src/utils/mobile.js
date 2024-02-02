export const isMobile = ref(false);

export function initMobileSizeEvent() {
    const media = window.matchMedia('not all and (min-width: 640px)');
    const addListener =  media?.addEventListener ||  media.addListener;
    const removeListener =  media?.removeEventListener ||  media.removeListener;
    addListener('change', onSize);
    removeListener('change', onSize);
    onSize(media);
}

const onSize = (e) => {
    isMobile.value = e.matches;
};
