export const cookieManager = ref(false);

export function initCookieManager() {
    cookieManager.value = inject('$cookies');
}

/**
 *
 * @returns any
 */
export function useCookieManager() {
    return cookieManager.value;
}
