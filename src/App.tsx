import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Views/Home';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer.tsx';
import CustomCursor from './components/CustomCursor';
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
    window.scrollTo(0, 0)
  }, [])

  return (
    <Router>
        <CustomCursor />
        <Navbar/>
        <Routes>
          {/* Define routes to render specific components based on URL */}
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
        <Footer/>

    </Router>
  );
};

export default App;