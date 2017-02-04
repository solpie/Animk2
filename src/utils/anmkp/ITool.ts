export interface ITool {
    down(x: number, y: number, pressure: number):void
    up(x: number, y: number, pressure: number):void
    move(x: number, y: number, pressure: number):void
    setContext(context:any):void
} 