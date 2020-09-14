"use strict";
exports.__esModule = true;
var log = console.log; //todo: replace with real logger after v0.1
exports.log = log;
//todo: extract
var SeqGen = /** @class */ (function () {
    function SeqGen() {
    }
    SeqGen.next = function () {
        return SeqGen.sequence++;
    };
    SeqGen.sequence = 0;
    return SeqGen;
}());
exports.SeqGen = SeqGen;
var TradeId = /** @class */ (function () {
    function TradeId() {
    }
    TradeId.next = function () {
        return SeqGen.sequence++;
    };
    TradeId.sequence = 0;
    return TradeId;
}());
exports.TradeId = TradeId;
