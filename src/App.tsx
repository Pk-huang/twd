// src/App.tsx
import "./css/twd.css";
import Navbar from "./compent/nav";
import ConverterContainer from "./compent/ConverterContainer";
import {getTimeseries} from "./services/ratesTimeseries";
// 測試用
getTimeseries({
  start: "2023-01-01",
  end: "2023-01-31",
  base: "USD",
  symbol: "TWD", // Adjusted to pass a single currency as required
}).then((data) =>
  console.log("timeseries", data) 
);

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <div className="container mt-lg-5 mt-md-3 mt-sm-1">
          <ConverterContainer />
        </div>
      </main>
      <footer>{/* ... */}</footer>
    </>
  );
}