import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.tsx';
import Home from './pages/Home.tsx';
import Committees from './pages/Committees.tsx';
import Register from './pages/Register.tsx';
import IntroAnimation from './components/layout/IntroAnimation.tsx';
import { TransitionProvider } from './components/layout/TransitionContext.tsx';

const App: React.FC = () => {
  return (
    <>
      <IntroAnimation />
      <Router>
        <TransitionProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="committees" element={<Committees />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </TransitionProvider>
      </Router>
    </>
  );
};

export default App;
