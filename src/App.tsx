import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Views/Home';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer.tsx';
import DesignSystems from './Views/Projects/DesignSystems.tsx'
import IconPack from './Views/Projects/IconPack.tsx';
import DesignThinking from './Views/Projects/DesignThinking.tsx';
import Guide from './Views/Projects/Guide.tsx';
import Arine from './Views/Projects/Arine.tsx';


const App: React.FC = () => {
  return (
    <Router>

        <Navbar/>
        <Routes>
          {/* Define routes to render specific components based on URL */}
          <Route path="/" element={<Home />} />       
          <Route path="/design-systems" element={<DesignSystems />} />
          <Route path="/icon-pack" element={<IconPack />} /> 
          <Route path="/guide" element={<Guide />} /> 
          <Route path="/design-thinking" element={<DesignThinking />} /> 
          <Route path="/arine" element={<Arine />} /> 

        </Routes>
        <Footer/>

    </Router>
  );
};

export default App;