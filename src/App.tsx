import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import SmsRecords from "@/pages/SmsRecords";
import MyEvaluation from "@/pages/MyEvaluation";
import { useApplicationStore } from "@/store/useApplicationStore";
import { useSmsStore } from "@/store/useSmsStore";

function AppContent() {
  const initApplications = useApplicationStore((state) => state.init);
  const loadSmsRecords = useSmsStore((state) => state.loadFromStorage);

  useEffect(() => {
    initApplications();
    loadSmsRecords();
  }, [initApplications, loadSmsRecords]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="items" element={<Items />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route path="guide" element={<Guide />} />
        <Route
          path="apply"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'worker']}>
              <Apply />
            </ProtectedRoute>
          }
        />
        <Route
          path="apply/:itemId"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'worker']}>
              <Apply />
            </ProtectedRoute>
          }
        />
        <Route
          path="materials"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'worker']}>
              <Materials />
            </ProtectedRoute>
          }
        />
        <Route
          path="approval"
          element={
            <ProtectedRoute allowedRoles={['worker', 'approver', 'admin']}>
              <Approval />
            </ProtectedRoute>
          }
        />
        <Route
          path="progress"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'worker', 'approver', 'admin']}>
              <Progress />
            </ProtectedRoute>
          }
        />
        <Route
          path="statistics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Statistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-evaluation"
          element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <MyEvaluation />
            </ProtectedRoute>
          }
        />
        <Route
          path="sms"
          element={
            <ProtectedRoute allowedRoles={['citizen', 'worker', 'approver', 'admin']}>
              <SmsRecords />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
