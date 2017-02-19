import { FrameTimerEvent } from '../const';
import { EventDispatcher } from '../../utils/EventDispatcher';
export class FrameTimer extends EventDispatcher {
    _isBusy: boolean = false;

    _timerId = null;

    _framerate:number
    
    constructor(framerate) {
        super();
        this.setFramerate(framerate);
    }

    start() {
        if (!this._isBusy)
            this.newTimer();
        this._isBusy = true;
    }

    stop() {
        this._isBusy = false;
        //todo necessary
        this.clearTimer();
    }

    isBusy() {
        return this._isBusy;
    }

    setFramerate(framerate) {
        if (this._framerate != framerate) {
            this._framerate = framerate;
            
            this.clearTimer();
            this.newTimer();
        }
    }

    clearTimer() {
        if (this._timerId) {
            clearInterval(this._timerId);
        }
        this._timerId = null;
    }

    newTimer() {
        this._timerId = setInterval(() => {
            this.onTick();
        }, 1000 / this._framerate)
    }

    onTick() {
        if (this._isBusy) {
            this.emit(FrameTimerEvent.TICK);
            //console.log(this, "tick");
        }
        else {
            this.clearTimer();
        }
    }
}