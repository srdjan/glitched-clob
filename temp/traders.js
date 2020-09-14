"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var traders = new Map();
function getOrCreate(userName) {
    if (traders.has(userName)) {
        return traders.get(userName);
    }
    utils_1.log("Traders.getOrCreate: auto registering " + userName);
    var trader = { username: userName, password: 'todo' };
    traders.set(trader.username, trader);
    return trader;
}
exports.getOrCreate = getOrCreate;
function verify(userName) {
    if (!traders.has(userName)) {
        throw new Error("Traders.verify: invalid user: " + userName + ", order not allowed");
    }
    return true;
}
exports.verify = verify;
