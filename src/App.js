import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Coins from "./components/Coins";
import CoinDetails from "./components/CoinDetails";
// import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Coins />} />
        <Route path="/coin/:id" element={<CoinDetails />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
