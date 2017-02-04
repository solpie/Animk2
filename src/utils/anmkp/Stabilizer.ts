export class Stabilizer {
    getParamTable() { //for test
        return this.paramTable;
    }
    paramTable = [];
    current
    upCalled = false;
    move(x, y, pressure) {
        this.current.x = x;
        this.current.y = y;
        this.current.pressure = pressure;
    }
    up(x, y, pressure) {
        this.current.x = x;
        this.current.y = y;
        this.current.pressure = pressure;
        this.upCalled = true;
    }
    _move(justCalc?) {
        var curr;
        var prev;
        var dx;
        var dy;
        var dp;
        var delta = 0;
        this.first.x = this.current.x;
        this.first.y = this.current.y;
        this.first.pressure = this.current.pressure;
        for (var i = 1; i < this.paramTable.length; ++i) {
            curr = this.paramTable[i];
            prev = this.paramTable[i - 1];
            dx = prev.x - curr.x;
            dy = prev.y - curr.y;
            dp = prev.pressure - curr.pressure;
            delta += Math.abs(dx);
            delta += Math.abs(dy);
            curr.x = this.dlerp(curr.x, dx, this.follow);
            curr.y = this.dlerp(curr.y, dy, this.follow);
            curr.pressure = this.dlerp(curr.pressure, dp, this.follow);
        }
        if (justCalc)
            return delta;
        if (this.upCalled) {
            while (delta > 1) {
                this.tool.move(this.last.x, this.last.y, this.last.pressure);
                delta = this._move(true);
            }
            this.up(this.last.x, this.last.y, this.last.pressure);
        }
        else {
            this.tool.move(this.last.x, this.last.y, this.last.pressure);
            window.setTimeout(() => { this._move() }, this.interval);
        }
    }
    first
    last
    tool
    interval
    follow
    constructor(tool, move1, up, level, weight,
        x, y, pressure, interval) {
        this.interval = interval || 5;
        this.current = { x: x, y: y, pressure: pressure };
        this.follow = 1 - Math.min(0.95, Math.max(0, weight));
        for (var i = 0; i < level; ++i)
            this.paramTable.push({ x: x, y: y, pressure: pressure });
        this.first = this.paramTable[0];
        this.last = this.paramTable[this.paramTable.length - 1];

        if (tool != null)
            tool.down(x, y, pressure);
        this.tool = tool
        window.setTimeout(() => {
            this._move()
        }, this.interval);
    }
    dlerp(a, d, t) {
        return a + d * t;
    }
}
