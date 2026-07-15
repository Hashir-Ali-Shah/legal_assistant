import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-serif font-bold text-black mb-4">
                    404
                </h1>
                <h2 className="text-3xl font-serif font-bold mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/">
                    <Button icon={<Home className="w-4 h-4" />}>
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
