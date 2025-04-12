import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SidebarContainer = styled.aside`
  width: 240px;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-right: 1px solid ${({ theme }) => theme.colors.text.disabled};
  padding: ${({ theme }) => theme.spacing.medium};
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.light};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <NavList>
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/robots">Robot Management</NavItem>
        <NavItem to="/settings">Settings</NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;
