import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SignupForm from '../../frontend/src/components/auth/SignupForm.jsx';

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn()
}));

vi.mock('../../frontend/src/context/AuthContext.jsx', () => ({
    useAuth: () => ({
        signup: vi.fn().mockResolvedValue(true)
    })
}));

describe('SignupForm', () => {
    it('renders all required inputs', () => {
        render(<SignupForm />);
        expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Create a strong password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting empty form', async () => {
        render(<SignupForm />);
        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText('Name is required')).toBeInTheDocument();
        expect(await screen.findByText('Email is required')).toBeInTheDocument();
        expect(await screen.findByText('Password is required')).toBeInTheDocument();
    });
});
