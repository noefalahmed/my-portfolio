import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Views/Home';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor'
import Stars from './components/Stars'
import DesignSystems from './Views/Projects/DesignSystems.tsx'
import DesignThinking from './Views/Projects/DesignThinking.tsx';
import Guide from './Views/Projects/Guide.tsx';
import Arine from './Views/Projects/Arine.tsx';
import About from './Views/About.tsx';
import Precisely from './Views/Projects/Precisely.tsx'
import Accessibility from './Views/Projects/Accessibility.tsx';
import SpeechCoach from './Views/Projects/SpeechCoach.tsx';


const App: React.FC = () => {

  useEffect(() => {
    let overlay = document.getElementById('zoom-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'zoom-overlay';
      const img = document.createElement('img');
      overlay.appendChild(img);
      document.body.appendChild(overlay);
    }
    const zoomedImg = overlay.querySelector('img') as HTMLImageElement;

    function close() {
      overlay!.classList.add('closing');
      setTimeout(() => { overlay!.classList.remove('active', 'closing'); }, 200);
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.matches('img[data-zoom]')) {
        zoomedImg.src = (target as HTMLImageElement).src;
        overlay!.classList.remove('closing');
        overlay!.classList.add('active');
      }
    }

    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') close(); }

    overlay.addEventListener('click', close);
    zoomedImg.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [])

  return (
    <Router>
        <Stars />
        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <CustomCursor />
          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/design-systems" element={<DesignSystems />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/design-thinking" element={<DesignThinking />} />
            <Route path="/arine" element={<Arine />} />
            <Route path="/about" element={<About />} />
            <Route path="/Precisely" element={<Precisely />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/speech-coach" element={<SpeechCoach />} />
          </Routes>
        </div>
    </Router>
  );
};

export default App;