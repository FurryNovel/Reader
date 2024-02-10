export function defineBaseStore() {
    return {
        id: 'abstract',
        persist: true,
        lazy: false,
        driver: null,
        state: () => {
            return {
                prefix: 'pk-',
                expire: null,
            }
        },
        actions: {
            async find(id) {
                if (this.options.lazy) {
                    let res = await this.driver.getItem(this.prefix + id).then((value) => {
                        return value?.value;
                    });
                    if (res) {
                        this.$state[this.prefix + id] = res;
                    }
                }
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
