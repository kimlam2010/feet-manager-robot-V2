import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.large};
`;

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
    </DashboardContainer>
  );
};

export default Dashboard;
