import React, { useEffect, useState } from "react";
import "./App.css";
import { useServerEvents } from "./serverEvents/useServerEvents";
import { formatPrice } from "./utils/formatPrice";
import { useEventFetch } from "./serverEvents/useEventFetch";

export const BaseURL = "http://localhost:8000";

type ExchangeOrder = {
  type: "exchange-order";
  id: number;
  ticker: string;
  price: number;
};

type ClientOrder = {
  type: "client-order";
  id: number;
  ticker: string;
  price: number;
  client: string;
};

type StockPrice = ExchangeOrder | ClientOrder;

function App() {
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);
  const [exchangeOrder] = useServerEvents<ClientOrder>("client-order");

  const clientOrders = useEventFetch<StockPrice>({
    fetchInterval: 1000,
    initialUrl: `${BaseURL}/client-orders`,
    diffUrl: `${BaseURL}/client-orders-diff`,
    mapIdField: "id",
  });

  const updateStockPrices = (data: StockPrice) => {
    setStockPrices((stockPrices) => {
      return [
        ...stockPrices.filter((value) => value.ticker !== data.ticker),
        data,
      ].sort((a, b) => a.id - b.id);
    });
  };

  useEffect(() => {
    if (exchangeOrder) {
      updateStockPrices(exchangeOrder);
    }
  }, [exchangeOrder]);

  return (
    <div className="App">
      <table>
        <caption>Stock Prices</caption>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Ticker Symbol</th>
            <th>Real Time Price</th>
          </tr>
        </thead>
        <tbody>
          {stockPrices.map(({ id, ticker, price }, index) => (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{ticker}</td>
              <td>{formatPrice(price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;
