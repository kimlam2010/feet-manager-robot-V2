import React from 'react';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.large};
`;

const Settings: React.FC = () => {
  return (
    <SettingsContainer>
      <h1>Settings</h1>
    </SettingsContainer>
  );
};

export default Settings;
