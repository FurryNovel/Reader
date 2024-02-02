export function defineBaseStore() {
    return {
        id: 'abstract',
        persist: true,
        state: () => {
            return {
                prefix: 'pk-',
                expire: null,
            }
        },
        actions: {
            find(id) {
                return this.$state?.[this.prefix + id] || this?.[this.prefix + id];
            },
            save(id, data) {
                const patch = {};
                patch[this.prefix + id] = data;
                this.$patch(patch);
            },
            setExpire(expire) {
                this.$patch({
                    expire: expire,
                });
            },
            getExpire() {
                return this.$state?.expire || this?.expire;
            },
        },
    }
}
