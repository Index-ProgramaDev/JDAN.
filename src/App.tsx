import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Intro from './pages/Intro';
import Blogs from './pages/Blogs';
import Servicos from './pages/Services';
import Projetos from './pages/Projects';
import NotFound from './Notfound';
// Criando componentes 


export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/projetos" element={<Projetos />} />
      </Routes>
    </div>
  );
}