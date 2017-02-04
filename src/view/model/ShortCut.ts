import { appInfo } from './AppInfo';
import { input, InputEvent } from '../../utils/Input';
export const keyDownMap = {}
export const keyUpMap = {}
const makeKeyString = (e):string => {
    let k = e.key.toLowerCase()
    if (e.shiftKey && k != 'shift') {
        k = 'shift+' + k
    }
    if (e.altKey && k != 'alt') {
        k = 'alt+' + k
    }
    if (e.ctrlKey && k != 'ctrl') {
        k = 'ctrl+' + k
    }
    return k
}
export const initShortCut = () => {
    input.on(InputEvent.KEY_DOWN, (e) => {
        let k = makeKeyString(e)
        keyDownMap['f'] = () => {
            appInfo.curComp().forward()
        }
        keyDownMap['d'] = () => {
            appInfo.curComp().backward()
        }
        keyDownMap['enter'] = () => {
            appInfo.curComp().makePsd(() => {
            })
        }
        keyDownMap['f12'] = () => {
           window['remote'].getCurrentWindow().webContents.toggleDevTools()
        }
        if (keyDownMap[k])
            keyDownMap[k](e)
    })
    input.on(InputEvent.KEY_UP, (e) => {
        let k = makeKeyString(e)
         if (keyUpMap[k])
            keyUpMap[k](e)
    })    
}

