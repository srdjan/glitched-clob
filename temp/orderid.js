"use strict";
exports.__esModule = true;
var OrderId = /** @class */ (function () {
    function OrderId() {
    }
    OrderId.next = function (ticker, side) {
        var uid = OrderId.idSequence++;
        return ticker + "." + side + "." + uid;
    };
    OrderId.fromString = function (id) {
        var idFields = id.split('.');
        try {
            return {
                ticker: idFields[0],
                side: idFields[1],
                id: idFields[2]
            };
        }
        catch (e) {
            throw new Error("Order: Invalid id string format " + id);
        }
    };
    OrderId.asString = function (orderId) {
        return orderId.ticker + "." + orderId.side + "." + orderId.id;
    };
    OrderId.idSequence = 0;
    return OrderId;
}());
exports["default"] = OrderId;
