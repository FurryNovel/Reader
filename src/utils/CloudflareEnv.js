const cloudflareEnv = ref(null);

export function useCloudflareEnv() {
    return cloudflareEnv;
}

export function initCloudflareEnv(params) {
    cloudflareEnv.value = params;
}
