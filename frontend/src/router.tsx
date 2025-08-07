import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Diagnosis from './pages/Diagnosis';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
      </Routes>
    </BrowserRouter>
  );
}
