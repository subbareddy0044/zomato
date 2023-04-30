import { Route, Routes } from "react-router-dom";
import QuickSearch from "./components/filter/QuickSearch";
import Home from "./components/home/Home";
import Restaurant from "./components/restaurent/Restaurant";

function App() {
  return (
    <>
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quick-search/:meal_id" element={<QuickSearch />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
