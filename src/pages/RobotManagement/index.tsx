import React from 'react';
import styled from 'styled-components';

const RobotManagementContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.large};
`;

const RobotManagement: React.FC = () => {
  return (
    <RobotManagementContainer>
      <h1>Robot Management</h1>
    </RobotManagementContainer>
  );
};

export default RobotManagement;
