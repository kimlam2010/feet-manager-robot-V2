import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RobotManagement from './pages/RobotManagement';
import Settings from './pages/Settings';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/robots" element={<RobotManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
