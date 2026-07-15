import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '../../frontend/src/components/auth/LoginForm.jsx';

// Mock the routing hooks
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn()
}));

// Mock the AuthContext
vi.mock('../../frontend/src/context/AuthContext.jsx', () => ({
    useAuth: () => ({
        login: vi.fn().mockResolvedValue(true),
        adminLogin: vi.fn()
    })
}));

describe('LoginForm', () => {
    it('renders email and password inputs', () => {
        render(<LoginForm />);
        expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting empty form', async () => {
        render(<LoginForm />);
        const submitButton = screen.getByRole('button', { name: /log in/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Email is required')).toBeInTheDocument();
        expect(await screen.findByText('Password is required')).toBeInTheDocument();
    });
});
