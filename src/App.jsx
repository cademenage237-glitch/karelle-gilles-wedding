import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Admin from './pages/Admin';
import CheckIn from './pages/CheckIn';
import AdminGate, { isAdminUnlocked } from './pages/AdminGate';
import CheckInGate, { isCheckinUnlocked } from './pages/CheckInGate';

function ProtectedAdmin() {
  const [unlocked, setUnlocked] = useState(isAdminUnlocked());
  if (!unlocked) return <AdminGate onUnlock={() => setUnlocked(true)} />;
  return <Admin />;
}

function ProtectedCheckIn() {
  const [unlocked, setUnlocked] = useState(isCheckinUnlocked());
  if (!unlocked) return <CheckInGate onUnlock={() => setUnlocked(true)} />;
  return <CheckIn />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route path="/checkin" element={<ProtectedCheckIn />} />
      </Routes>
    </BrowserRouter>
  );
}
