import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { authService } from '../api/services/authService';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        dispatch(loginStart());
        const response = await authService.login({ username, password });
        dispatch(loginSuccess(response));
        navigate('/');
      } catch (error) {
        dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
      }
    },
    [dispatch, navigate]
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        dispatch(loginStart());
        const response = await authService.register({ username, email, password });
        dispatch(loginSuccess(response));
        navigate('/');
      } catch (error) {
        dispatch(loginFailure(error instanceof Error ? error.message : 'Registration failed'));
      }
    },
    [dispatch, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout on client side even if server request fails
      dispatch(logoutAction());
      navigate('/login');
    }
  }, [dispatch, navigate]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      await authService.resetPassword(token, newPassword);
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      await authService.changePassword(oldPassword, newPassword);
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      await authService.verifyEmail(token);
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
  };
}; 