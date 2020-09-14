"use strict";
exports.__esModule = true;
var OrderHistory = /** @class */ (function () {
    function OrderHistory() {
    }
    OrderHistory.push = function (order) {
        this.store.set(this.sequenceId++, order);
    };
    OrderHistory.store = new Map();
    OrderHistory.sequenceId = 0;
    return OrderHistory;
}());
exports["default"] = OrderHistory;
