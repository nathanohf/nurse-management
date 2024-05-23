import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nurses from "./pages/Nurses";
import "./style.css";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nurses/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;