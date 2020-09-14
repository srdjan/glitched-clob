"use strict";
exports.__esModule = true;
var order_1 = require("./order");
var Trades = /** @class */ (function () {
    function Trades() {
    }
    Trades.initializeTrade = function (ticker) {
        return {
            ticker: ticker,
            price: 0,
            quantity: 0,
            buyOrder: order_1.getEmptyOrder(),
            sellOrder: order_1.getEmptyOrder(),
            createdAt: Trades.idSequence++,
            message: 'None'
        };
    };
    Trades.insert = function (trade) {
        Trades.trades.push(trade);
    };
    Trades.idSequence = 0;
    Trades.trades = new Array();
    return Trades;
}());
exports.Trades = Trades;
