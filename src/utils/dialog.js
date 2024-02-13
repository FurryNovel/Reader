import eventbus from "@/utils/eventbus.js";

export default {
    alert({title, content, cancelBtn, confirmBtn}) {
        return new Promise((resolve, reject) => {
            eventbus.once('dialogClick', ({type}) => {
                if (type === 'confirm') {
                    resolve();
                } else {
                    reject();
                }
            });
            eventbus.emit('showDialog', {title, content, cancelBtn, confirmBtn});
        });
    },
    input({title, content, cancelBtn, confirmBtn, placeholder = ''}) {
        return new Promise((resolve, reject) => {
            eventbus.once('dialogClick', data => {
                const {type} = data;
                if (type === 'confirm') {
                    resolve(data);
                } else {
                    reject(data);
                }
            });
            eventbus.emit('showDialog', {title, content, cancelBtn, confirmBtn, input: placeholder});
        });
    },
    toast({type, content, title = '提示'}) {
        eventbus.emit('showToast', {type, content, title});
    },
    challenge() {
        eventbus.emit('showChallenge', {});
        return new Promise((resolve, reject) => {
            eventbus.once('onChallenged', function (e) {
                resolve(e);
            });
        });
        
    }
}
