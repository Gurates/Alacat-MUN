import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.tsx';
import Home from './pages/Home.tsx';
import Committees from './pages/Committees.tsx';
import Register from './pages/Register.tsx';
import RegisterDelegate from './pages/RegisterDelegate.tsx';
import RegisterDelegation from './pages/RegisterDelegation.tsx';
import RegisterChairboard from './pages/RegisterChairboard.tsx';
import RegisterAdmin from './pages/RegisterAdmin.tsx';
import RegisterPress from './pages/RegisterPress.tsx';
import Teams from './pages/Teams.tsx';
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
              <Route path="register/delegate" element={<RegisterDelegate />} />
              <Route path="register/delegation" element={<RegisterDelegation />} />
              <Route path="register/chairboard" element={<RegisterChairboard />} />
              <Route path="register/admin" element={<RegisterAdmin />} />
              <Route path="register/press" element={<RegisterPress />} />
              <Route path="teams" element={<Teams />} />
            </Route>
          </Routes>
        </TransitionProvider>
      </Router>
    </>
  );
};

export default App;
