import { Routes, Route, Navigate } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  Dashboard,
  AddQuery,
  AddVendor,
  SendMails,
  ViewProposals,
} from "./pages";
import useStore from "./store";

function App() {
  const { user } = useStore();

  return (
    <Routes>
      {!user?.user && (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
      {user?.user && (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-query" element={<AddQuery />} />
          <Route path="/add-vendor" element={<AddVendor />} />
          <Route path="/send-mails" element={<SendMails />} />
          <Route path="/view-proposals" element={<ViewProposals />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/sign-up"
            element={<Navigate to="/dashboard" replace />}
          />
        </>
      )}
    </Routes>
  );
}

export default App;