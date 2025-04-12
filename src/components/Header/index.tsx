import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.h4};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const NavLink = styled(Link)`
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.light};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Title>Feet Manager Robot</Title>
      <Nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/robots">Robots</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
