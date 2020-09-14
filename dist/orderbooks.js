"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var order_1 = require("./order");
var orderid_1 = require("./orderid");
var utils_1 = require("./utils");
var OrderBooks = new Map();
var _sortAscByLimit = function (a, b) {
    return (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1);
};
var _sortDscByLimit = function (a, b) {
    return (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1);
};
function getOrderBook(ticker) {
    var orderBook = OrderBooks.get(ticker);
    if (!orderBook) {
        utils_1.log("OrderBooks.getTicker: initiate new OrderBook for: " + ticker);
        return { buys: [], sells: [] };
    }
    var buys = Array.from(orderBook.buySide.values()).sort(function (a, b) { return b.limit - a.limit; });
    var sells = Array.from(orderBook.sellSide.values()).sort(function (a, b) { return a.limit - b.limit; });
    var openBuys = buys.filter(function (o) { return o.status === 'Open'; });
    utils_1.log("OPEN BUYS: " + JSON.stringify(openBuys));
    var openSells = sells.filter(function (o) { return o.status === 'Open'; });
    utils_1.log("OPEN SELLS: " + JSON.stringify(openSells));
    return { buys: openBuys, sells: openSells };
}
exports.getOrderBook = getOrderBook;
function getOrderHistory(ticker) {
    var orderBook = OrderBooks.get(ticker);
    if (!orderBook) {
        utils_1.log("OrderBooks.getAll: initiate new OrderBook for: " + ticker);
        OrderBooks.set(ticker, {
            buySide: new Map(),
            sellSide: new Map()
        });
        return new Array();
    }
    var merged = Array.from(orderBook.buySide.values()).concat(Array.from(orderBook.sellSide.values()));
    var sorted = merged.sort(function (a, b) { return a.createdAt - b.createdAt; });
    return sorted;
}
exports.getOrderHistory = getOrderHistory;
var get = function (id) {
    var _a, _b;
    var orderId = orderid_1["default"].fromString(id); //validate
    var orderBook = OrderBooks.get(orderId.ticker);
    if (!orderBook) {
        OrderBooks.set(orderId.ticker, {
            buySide: new Map(),
            sellSide: new Map()
        });
        return order_1.getEmptyOrder();
    }
    var order = orderId.side === 'Buy'
        ? (_a = orderBook) === null || _a === void 0 ? void 0 : _a.buySide.get(id) : (_b = orderBook) === null || _b === void 0 ? void 0 : _b.sellSide.get(id);
    if (!order) {
        throw new Error("Orderbooks.getOrder: Order with id: " + id + " not found");
    }
    return order;
};
exports.get = get;
function cancel(id) {
    var order = get(id);
    if (!order) {
        throw new Error("Orderbook.cancelOrderById: Order for id:" + id + " not found");
    }
    var orderBook = OrderBooks.get(order.ticker);
    if (!orderBook) {
        throw new Error("Orderbook.deleteOrderById: OrderBook for ticker:" + order.ticker + " not found");
    }
    return _remove(orderBook, order);
}
exports.cancel = cancel;
function _remove(orderBook, order) {
    order.cancel();
    if (order.side === 'Buy') {
        orderBook.buySide["delete"](order.id);
        var sorted = new Map(__spread(orderBook.buySide).sort(_sortAscByLimit));
        orderBook.buySide = sorted;
    }
    else {
        orderBook.sellSide["delete"](order.id);
        var sorted = new Map(__spread(orderBook.sellSide).sort(_sortDscByLimit));
        orderBook.sellSide = sorted;
    }
    return true;
}
function update(orderBook, order) {
    order.update();
    if (orderBook && order.side === 'Buy') {
        orderBook.buySide.set(order.id, order);
    }
    if (orderBook && order.side === 'Sell') {
        orderBook.sellSide.set(order.id, order);
    }
}
exports.update = update;
function insert(order) {
    if (!OrderBooks.has(order.ticker)) {
        utils_1.log("Orderbooks.insert: initiate new OrderBook for ticker: " + order.ticker);
        OrderBooks.set(order.ticker, {
            buySide: new Map(),
            sellSide: new Map()
        });
    }
    var orderBook = OrderBooks.get(order.ticker);
    if (orderBook && order.side === 'Buy') {
        orderBook.buySide.set(order.id, order);
        var sorted = new Map(__spread(orderBook.buySide).sort(_sortAscByLimit));
        utils_1.log("sorted buys: " + JSON.stringify(sorted.entries()));
        orderBook.buySide = sorted;
    }
    if (orderBook && order.side === 'Sell') {
        orderBook.sellSide.set(order.id, order);
        var sorted = new Map(__spread(orderBook.sellSide).sort(_sortDscByLimit));
        utils_1.log("sorted sells: " + JSON.stringify(sorted.entries()));
        orderBook.sellSide = sorted;
    }
    return orderBook;
}
exports.insert = insert;
function clearAll() {
    OrderBooks.clear();
}
exports.clearAll = clearAll;
