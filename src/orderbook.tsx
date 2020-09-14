import React from "react";

type OrderBookProps = {buys: Array<string>, sells: Array<string>}

const OrderBook = ({ buys, sells }: OrderBookProps) => {
  const rows = (arr: Array<string>) =>
    arr &&
    arr.map((item, index) => (
      <tr key={index}>
        <td>${item}</td>
      </tr>
    ));

  return (
    <table>
      <tr>
        <td valign="top">
          <table>
            <thead>
              <tr>
                <th>Buy [Price,Size]</th>
              </tr>
            </thead>
            <tbody className="buy">{rows(buys)}</tbody>
          </table>
        </td>
        <td valign="top">
          <table>
            <thead>
              <tr>
                <th>Sell [Price, Size]</th>
              </tr>
            </thead>
            <tbody className="sell">{rows(sells)}</tbody>
          </table>
        </td>
      </tr>
    </table>
  );
};

export default OrderBook;