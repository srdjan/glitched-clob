"use strict";
exports.__esModule = true;
var orderid_1 = require("./orderid");
var utils_1 = require("./utils");
var orderHistory_1 = require("./orderHistory");
var Order = /** @class */ (function () {
    function Order(trader, ticker, side, limit, quantity) {
        this.id = orderid_1["default"].next(ticker, side);
        this.trader = trader;
        this.ticker = ticker;
        this.side = side;
        this.limit = limit;
        this.quantity = quantity;
        this.filledQuantity = 0;
        this.status = 'Open';
        this.createdAt = utils_1.SeqGen.next();
        orderHistory_1["default"].push(this);
    }
    Order.prototype.cancel = function () {
        this.status = 'Canceled';
        orderHistory_1["default"].push(this);
    };
    Order.prototype.update = function () {
        orderHistory_1["default"].push(this);
    };
    Order.prototype.complete = function () {
        this.status = 'Completed';
        orderHistory_1["default"].push(this);
    };
    return Order;
}());
exports.Order = Order;
function getEmptyOrder() {
    return new Order({ username: '', password: '' }, 'None', 'None', 0, 0);
}
exports.getEmptyOrder = getEmptyOrder;
