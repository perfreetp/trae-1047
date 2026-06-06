import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import Home from "@/pages/Home";
import Items from "@/pages/Items";
import ItemDetail from "@/pages/ItemDetail";
import Guide from "@/pages/Guide";
import Apply from "@/pages/Apply";
import Materials from "@/pages/Materials";
import Approval from "@/pages/Approval";
import Progress from "@/pages/Progress";
import Statistics from "@/pages/Statistics";
import Login from "@/pages/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="items" element={<Items />} />
          <Route path="items/:id" element={<ItemDetail />} />
          <Route path="guide" element={<Guide />} />
          <Route path="apply" element={<Apply />} />
          <Route path="apply/:itemId" element={<Apply />} />
          <Route path="materials" element={<Materials />} />
          <Route path="approval" element={<Approval />} />
          <Route path="progress" element={<Progress />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </Router>
  );
}
