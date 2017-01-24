import { EventDispatcher } from '../../utils/EventDispatcher';


export const InputEvent = {
    MOUSE_DOWN: 'onmousedown',
    MOUSE_MOVE: 'onmousemove',
    MOUSE_UP: 'onmouseup',
    KEY_UP: 'onkeyup',
    KEY_DOWN: 'onkeydown',
};
export const input = new EventDispatcher()
window.onmousedown = (e) => {
    e['mx'] = e.clientX
    e['my'] = e.clientY
    input.emit(InputEvent.MOUSE_DOWN, e)
}
window.onmousemove = (e) => {
    e['mx'] = e.clientX
    e['my'] = e.clientY
    input.emit(InputEvent.MOUSE_MOVE, e)
}
window.onmouseup = (e) => {
    e['mx'] = e.clientX
    e['my'] = e.clientY
    input.emit(InputEvent.MOUSE_UP, e)
}
window.onkeyup = (e) => {
    input.emit(InputEvent.KEY_UP, e)
}
window.onkeydown = (e) => {
    input.emit(InputEvent.KEY_DOWN, e)
}