// src/App.tsx
import "./css/twd.css";
import Navbar from "./compent/nav";
import ConverterContainer from "./compent/ConverterContainer";



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