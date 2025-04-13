import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import styled, { ThemeProvider } from 'styled-components';
import { store, persistor } from './store';
import { AuthProvider } from './contexts/AuthContext';
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

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
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
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
