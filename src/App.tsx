// src/App.tsx
import "./css/twd.css";
import Navbar from "./compent/nav";
import ConverterContainer from "./compent/ConverterContainer";
import { ThemeProvider } from "./function/theme/ThemeProvider"


export default function App() {
  return (
    <>
      <ThemeProvider>
      <Navbar />
      <main>
        <div className="container mt-lg-5 mt-md-3 mt-sm-1">
          <ConverterContainer />
        </div>
      </main>
      <footer />
    </ThemeProvider>
    </>
  );
}