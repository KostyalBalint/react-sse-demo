import React, { useEffect, useState } from "react";
import "./App.css";
import { useServerEvents } from "./serverEvents/useServerEvents";
import { formatPrice } from "./utils/formatPrice";

export const BaseURL = "http://localhost:8000";

type StockPrice = {
  id: number;
  ticker: string;
  price: number;
};

function App() {
  const [stockPrices, setStockPrices] = useState<StockPrice[]>([]);
  const { data } = useServerEvents<StockPrice>();

  //Fetch initial data
  const fetchStockPrice = () => {
    fetch(`${BaseURL}/stocks`, { method: "GET" })
      .then((res) => (res.status === 200 ? res.json() : { data: null }))
      .then((result) => setStockPrices(result.data));
  };

  const updateStockPrices = (data: StockPrice) => {
    setStockPrices((stockPrices) =>
      [...stockPrices].map((stock) => {
        if (stock.id === data.id) {
          return data;
        }
        return stock;
      }),
    );
  };

  useEffect(() => {
    fetchStockPrice();
  }, []);

  useEffect(() => {
    if (data) {
      updateStockPrices(data);
    }
  }, [data]);

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
