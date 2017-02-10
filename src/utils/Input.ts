import { EventDispatcher } from './EventDispatcher';


export const InputEvent = {
    MOUSE_DOWN: 'onmousedown',
    MOUSE_MOVE: 'onmousemove',
    MOUSE_WHEEL: 'onmousewheel',
    MOUSE_UP: 'onmouseup',
    KEY_UP: 'onkeyup',
    KEY_DOWN: 'onkeydown',
    stopPropagation: true
};

class Input extends EventDispatcher {
    isKeyPress = false
    isMousePress = false
    
    private _isDrag = false
    private _mid = null
    private _uid = null

    startDrag(moveFunc, upFunc) {
        if (this._isDrag)
            throw 'drag overload!!'
        this._mid = this.on(InputEvent.MOUSE_MOVE, (e) => {
            moveFunc(e)
        })
        this._uid = this.on(InputEvent.MOUSE_UP, (e) => {
            if (upFunc)
                upFunc(e)
            this.del(InputEvent.MOUSE_MOVE, this._mid)
            this.del(InputEvent.MOUSE_UP, this._uid)
        })

    }
}
export const input = new Input()

window.onmousedown = (e) => {
    e['mx'] = e.clientX
    e['my'] = e.clientY
    input.isMousePress = true
    input.emit(InputEvent.MOUSE_DOWN, e)
}
window.onmousemove = (e) => {
    e['mx'] = e.clientX
    e['my'] = e.clientY
    input.emit(InputEvent.MOUSE_MOVE, e)
}
window.onmousewheel = (e) => {
    e['mx'] = e.clientX
    e['my'] = e.clientY
    input.emit(InputEvent.MOUSE_WHEEL, e)
}
window.onmouseup = (e) => {
    e['mx'] = e.clientX
    e['my'] = e.clientY
    input.isMousePress = false
    input.emit(InputEvent.MOUSE_UP, e)
}
window.onkeyup = (e) => {
    input.isKeyPress = false
    input.emit(InputEvent.KEY_UP, e)
}
window.onkeydown = (e) => {
    input.isKeyPress = true
    input.emit(InputEvent.KEY_DOWN, e)
}
export const Curosr = {
    hand: 'hand',
    move: 'move',
    ns: 'ns-resize',
    pointer: 'pointer'
}
export const setCursor = (s?) => {
    if (!s)
        s = 'auto'
    document.body.style.cursor = s
}