import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useSession } from '../context/SessionContext';
import { auth } from '../firebase';

// Mock the useSession hook
jest.mock('../context/SessionContext', () => ({
  useSession: jest.fn(),
}));

// Mock the auth.signOut function
jest.mock('../firebase', () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    useSession.mockReturnValue({
      session: {
        user: {
          email: 'test@example.com',
          getIdToken: jest.fn().mockResolvedValue('test-token'),
        },
      },
    });
  });

  it('renders without crashing', () => {
    render(<Dashboard />);
  });

  it('calls handleLogout when the logout button is clicked', () => {
    render(<Dashboard />);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    expect(auth.signOut).toHaveBeenCalled();
  });

  it('displays the user email', () => {
    render(<Dashboard />);
    const emailElement = screen.getByText('Email: test@example.com');
    expect(emailElement).toBeInTheDocument();
  });

  it('fetches and displays resumes', async () => {
    const mockResumes = [{ id: '1', title: 'Resume 1' }, { id: '2', title: 'Resume 2' }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResumes),
    });

    render(<Dashboard />);
    // Wait for the resumes to load
    await screen.findByText('Resume 1');
    expect(screen.getByText('Resume 1')).toBeInTheDocument();
    expect(screen.getByText('Resume 2')).toBeInTheDocument();
  });
});