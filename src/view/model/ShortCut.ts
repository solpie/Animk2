import { appInfo } from './AppInfo';
import { input, InputEvent } from '../../utils/Input';
export const initShortCut = () => {
    input.on(InputEvent.KEY_DOWN, (e) => {
        let k = e.key
        let isCtrl = e.ctrlKey
        if (k == 'f') {
            appInfo.curComp().forward()
        }
        else if (k == 'd')
            appInfo.curComp().backward()
        else if (e.key == 'Enter') {
            appInfo.curComp().makePsd()
        }
    })
}

