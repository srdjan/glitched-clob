"use strict";
exports.__esModule = true;
var order_1 = require("./order");
var OrderBooks = require("./orderbooks");
var OrderBook = require("./engine");
var Traders = require("./traders");
var utils_1 = require("./utils");
var find = function (id) {
    try {
        return JSON.stringify(OrderBooks.get(id));
    }
    catch (e) {
        utils_1.log("Market.find: unexpected error, orderId: " + id);
    }
    return JSON.stringify({ Result: 'Unexpected Error' });
};
exports.find = find;
var post = function (username, ticker, side, limit, quantity) {
    utils_1.log("USERNAME: " + username);
    var trader = Traders.getOrCreate(username);
    var order = new order_1.Order(trader, ticker, side, limit, quantity);
    try {
        var response = OrderBook.match(order);
        if (response.trade.price === 0) {
            utils_1.log("Market.post: No Trade for orderId: " + order.id);
        }
        return JSON.stringify(response);
    }
    catch (e) {
        utils_1.log("Market.post: (1) unexpected error, order: " + order + ", error: " + e);
    }
    return JSON.stringify({ result: 'Unexpected Error' });
};
exports.post = post;
var cancel = function (userName, id) {
    try {
        Traders.verify(userName);
        if (!OrderBooks.cancel(id)) {
            throw new Error("Market.cancel: Order for id: " + id + " not found");
        }
        utils_1.log("Market.cancel: Order with id: " + id + " canceled");
        return JSON.stringify({ Result: 'Success' });
    }
    catch (e) {
        utils_1.log("Market.cancel: Unexpected error, order: " + id);
    }
    return JSON.stringify({ Result: 'Unexpected Error' });
};
exports.cancel = cancel;
function getOrderBook(ticker) {
    var orderBooks = OrderBooks.getOrderBook(ticker);
    var buys = orderBooks.buys.map(function (o) { return o.limit + "," + o.quantity; });
    var sells = orderBooks.sells.map(function (o) { return o.limit + "," + o.quantity; });
    return JSON.stringify({ buys: buys, sells: sells });
}
exports.getOrderBook = getOrderBook;
function getOrderHistory(ticker) {
    return Array.from(OrderBooks.getOrderHistory(ticker));
}
exports.getOrderHistory = getOrderHistory;
function clearAll() {
    OrderBooks.clearAll();
}
exports.clearAll = clearAll;
