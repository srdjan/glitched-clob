"use strict";
exports.__esModule = true;
var uWS = require('uWebSockets.js');
var Market = require("./market");
var utils_1 = require("./utils");
uWS
    .App()
    .ws('/*', {
    message: function (ws, request, isBinary) {
        var req = JSON.parse(Buffer.from(request).toString('utf8'));
        switch (req.msg) {
            case 'sub': {
                utils_1.log("Subscribe msg received: " + req.msg);
                ws.subscribe("clob/#"); // Subscribe to all topics (tickers)
                break;
            }
            case 'buy': {
                utils_1.log("Buy order for " + req.data.user + " " + req.data.ticker + ", limit: " + req.data.limit);
                var result = Market.post(req.data.user, req.data.ticker, req.data.side, req.data.limit, req.data.quantity);
                //todo: need better error handling
                //todo: get only Buy side (perf)
                result = Market.getOrderBook(req.data.ticker);
                ws.publish("clob/" + req.ticker, result);
                break;
            }
            case 'sell': {
                utils_1.log("Buy order for " + req.data.ticker + ", limit: " + req.data.limit);
                var result = Market.post(req.data.user, req.data.ticker, req.data.side, req.data.limit, req.data.quantity);
                //todo: need better error handling
                //todo: get only SELL side (perf)
                result = Market.getOrderBook(req.data.ticker);
                ws.publish("clob/" + req.ticker, result);
                break;
            }
        }
    }
})
    .listen(9001, function (listenSocket) {
    if (listenSocket) {
        utils_1.log('Listening to port 9001');
    }
});
