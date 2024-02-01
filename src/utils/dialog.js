import eventbus from "@/utils/eventbus.js";

export default {
    alert({title, content, cancelBtn, confirmBtn}) {
        return new Promise((resolve, reject) => {
            eventbus.once('dialogClick', type => {
                if (type === 'confirm') {
                    resolve();
                }else{
                    reject();
                }
            });
            eventbus.emit('showDialog', {title, content, cancelBtn, confirmBtn});
        });
    },
    toast({type, content, title = '提示'}) {
        eventbus.emit('showToast', {type, content, title});
    }
}
