import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CreateProfilePage from './pages/CreateProfilePage';
import AdminPage from './pages/AdminPage';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<CreateProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/:username" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
