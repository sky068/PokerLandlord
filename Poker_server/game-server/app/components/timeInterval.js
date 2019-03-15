/**
 * Created by xujw on 2017/9/30.
 */
module.exports = function (app, opts) {
    return new TimeInterval(app, opts);
};

const DEFAULT_INTERVAL = 3000;
var TimeInterval = function(app, opts) {
    this.app = app;
    this.interval = opts.interval | DEFAULT_INTERVAL;
    this.timerId = null;
};

TimeInterval.name = '__TimeInterval__';

TimeInterval.prototype.start = function (cb) {
    console.log('TimeInterval Start');
    var self = this;
    this.timerId = setInterval(function() {
        console.log(self.app.getServerId() + ": Hello World!");
    }, this.interval);
    process.nextTick(cb);
};

TimeInterval.prototype.afterStart = function (cb) {
    console.log('TimeInterval afterStart');
    process.nextTick(cb);
};

TimeInterval.prototype.stop = function (force, cb) {
    console.log('TimeInterval stop');
    clearInterval(this.timerId);
    process.nextTick(cb);
};