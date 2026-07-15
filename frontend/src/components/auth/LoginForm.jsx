import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { isValidEmail } from '../../utils/helpers';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login, adminLogin } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Admin shortcut — no validation, no API call
        if (email === 'admin' && password === 'admin') {
            setLoading(true);
            try {
                adminLogin();
                navigate('/chat');
            } finally {
                setLoading(false);
            }
            return;
        }

        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password);
            navigate('/chat');
        } catch (error) {
            setErrors({ submit: error.message || 'Login failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
            />

            <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
            />

            {errors.submit && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg text-red-600 text-sm">
                    {errors.submit}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
            >
                Log In
            </Button>
        </form>
    );
}
