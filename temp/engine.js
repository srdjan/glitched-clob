"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var Engine = require("./orderbooks");
var trades_1 = require("./trades");
var utils_1 = require("./utils");
function match(order) {
    var e_1, _a;
    var trade = trades_1.Trades.initializeTrade(order.ticker);
    var orderBook = Engine.insert(order);
    var orderBookSide = order.side === 'Buy' ? orderBook.sellSide : orderBook.buySide;
    if (orderBookSide.size === 0) {
        utils_1.log("Orderbook.match: NO matched [" + order.side + "] side orders");
        return { order: order, trade: trade };
    }
    var openOrders = Array.from(orderBookSide.values()).filter(function (o) { return o.status === 'Open' && o.trader.username !== order.trader.username; });
    try {
        for (var openOrders_1 = __values(openOrders), openOrders_1_1 = openOrders_1.next(); !openOrders_1_1.done; openOrders_1_1 = openOrders_1.next()) {
            var matchOrder = openOrders_1_1.value;
            if (matchOrder.status !== 'Open') {
                continue;
            }
            if (matchOrder.trader.username === order.trader.username) {
                utils_1.log("Orderbook.getMatching: NOT allowed, same trader on both sides " + matchOrder.trader.username);
                continue;
            }
            if (order.side === 'Buy' && order.limit < matchOrder.limit) {
                utils_1.log("Orderbook.getMatching: NOT FOUND match " + matchOrder.id + " on the [" + matchOrder.side + "] side");
                continue;
            }
            if (order.side === 'Sell' && order.limit > matchOrder.limit) {
                utils_1.log("Orderbook.getMatching: NOT FOUND match " + matchOrder.id + " on the [" + matchOrder.side + "] side");
                continue;
            }
            trade.price = matchOrder.limit;
            trade.quantity =
                order.quantity > matchOrder.quantity
                    ? matchOrder.quantity
                    : order.quantity;
            trade.buyOrder = order.side === 'Buy' ? order : matchOrder;
            trade.sellOrder = order.side === 'Sell' ? order : matchOrder;
            trade.message = 'Success';
            trades_1.Trades.insert(trade);
            var available = order.quantity - order.filledQuantity;
            if (available > matchOrder.quantity) {
                order.status = 'Open';
                order.filledQuantity += available - matchOrder.quantity;
                matchOrder.status = 'Completed';
                matchOrder.filledQuantity = matchOrder.quantity;
            }
            else if (available < matchOrder.quantity) {
                order.status = 'Completed';
                order.filledQuantity = order.quantity;
                matchOrder.status = 'Open';
                matchOrder.filledQuantity += available;
            }
            else if (order.quantity === matchOrder.quantity) {
                order.status = 'Completed';
                order.filledQuantity = order.quantity;
                matchOrder.status = 'Completed';
                matchOrder.filledQuantity = matchOrder.quantity;
            }
            Engine.update(orderBook, order);
            Engine.update(orderBook, matchOrder);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (openOrders_1_1 && !openOrders_1_1.done && (_a = openOrders_1["return"])) _a.call(openOrders_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return { order: order, trade: trade };
}
exports.match = match;
