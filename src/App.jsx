import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Solver from './pages/Solver';
import PyqBank from './pages/PyqBank';
import Notes from './pages/Notes';
import History from './pages/History';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/solve" element={<Solver />} />
          <Route path="/pyqs" element={<PyqBank />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
