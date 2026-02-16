import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/DeviceList';
import DeviceDetails from './pages/DeviceDetails';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="devices" element={<DeviceList />} />
        <Route path="devices/:id" element={<DeviceDetails />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<div className="p-10">404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
