import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { auth } from '../firebase';
import { signInWithPopup, OAuthProvider } from 'firebase/auth';

// Mock the auth and firebase functions
jest.mock('../firebase', () => ({
  auth: {
    signInWithPopup: jest.fn(),
  },
}));

jest.mock('firebase/auth', () => ({
  OAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

describe('Login Component', () => {
  it('renders without crashing', () => {
    render(<Login />);
  });

  it('calls handleLogin when the login button is clicked', async () => {
    signInWithPopup.mockResolvedValue({});
    OAuthProvider.mockReturnValue({});

    render(<Login />);
    const loginButton = screen.getByText('Login with LinkedIn');
    fireEvent.click(loginButton);
    expect(signInWithPopup).toHaveBeenCalled();
  });
});