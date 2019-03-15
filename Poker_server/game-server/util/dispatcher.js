/**
 * Created by xujw on 2017/9/28.
 */
var crc = require('crc');

module.exports.dispatch = function(uid, connectors) {
    var index = Math.abs(crc.crc32(uid)) % connectors.length;
    return connectors[index];
};