// MP.js 游戏体力系统，根据时间恢复体力
cc.Class({
    extends: cc.Component,
    properties: {
        power: {
            default: 0,
            type: cc.Float
        },
        // 体力值
        powerDisplay: {
            type: cc.Label,
            default: null
        },
        // 恢复体力倒计时提示
        tipDisplay: {
            type: cc.Label,
            default: null
        },
        // 体力上限
        maxPower: {
            type: cc.Float,
            default: 0
        },
        // 恢复一个体力所需时间(s)
        timeLimit: {
            type: cc.Float,
            default: 0
        },
        // 记录体力开始恢复的时间点
        startTime: {
            type: cc.Float,
            default: 0
        },
        timer: '',
    },
    onLoad() {
        let that = this;
        this.initPower();
        cc.game.on(cc.game.EVENT_HIDE, function(){
            clearInterval(that.timer);
            console.log("游戏进入后台");
        }, this);

        cc.game.on(cc.game.EVENT_SHOW, function() {
            that.initPower();
            console.log("重新返回游戏");
        }, this);
    },
    // 初始化体力
    initPower() {
        this.power = 0;
        let power = parseInt(cc.sys.localStorage.getItem('power'));
        console.log('power',power);
        if(!(power>=0)){
            this.powerTimer(0);
        }
        else if(power == this.maxPower){
            this.gainPower(this.maxPower);
        }
        else if(power < this.maxPower){
            let time = parseInt(cc.sys.localStorage.getItem('timer'));
            let now = new Date().getTime();
            let temp = parseInt((now - time)/1000);
            if(parseInt(temp/this.timeLimit) + power >= this.maxPower){
                this.gainPower(this.maxPower);
            } else {
                this.gainPower(parseInt(temp/this.timeLimit));
                let t = temp%this.timeLimit;
                this.powerTimer(t);
            }
        }
        else if(power > this.maxPower){
            this.gainPower(this.maxPower);
        }
    },
    // 获得体力
    gainPower(power=1) {
        console.log('gainPower');
        this.power += power;
        this.powerDisplay.string = this.power;
        if(this.power == this.maxPower){
            this.tipDisplay.string = '体力值已满';
        }
        // 在本地存储获得体力的时间和当前体力值
        cc.sys.localStorage.setItem('power', this.power);
        cc.sys.localStorage.setItem('timer', new Date().getTime());
    },
    // 扣除体力值
    usePower() {
        console.log('usePower');
        if(this.power == this.maxPower){
            this.powerTimer(0);
        }
        if(this.power > 0){
            this.power -= 1;
            this.powerDisplay.string = this.power;
            cc.sys.localStorage.setItem('power', this.power);
            cc.sys.localStorage.setItem('timer', new Date().getTime());
        } else {
            cc.log('没有体力值！');
        }
    },
    // 计时器，按时恢复体力
    powerTimer(time) {
        let that = this;
        that.timer = setInterval(() => {
            time++;
            that.tipDisplay.string = (that.timeLimit - time) + '秒后恢复1点体力';
            if(time == that.timeLimit){
                if(that.power < that.maxPower){
                    that.gainPower();
                    time = 0;
                    // console.log(that.maxPower,that.power);
                    if( that.power == that.maxPower ){
                        clearInterval(that.timer);
                    }
                }
            }
        },1000)
    },
});
