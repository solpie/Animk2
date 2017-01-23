import { InputEvent } from '../const';
import { EventDispatcher } from '../../utils/EventDispatcher';
export const input = new EventDispatcher()
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