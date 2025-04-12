import React from 'react';
import styled from 'styled-components';
import Header from '../Header';
import Sidebar from '../Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
`;

const Content = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        <Sidebar />
        <Content>{children}</Content>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
