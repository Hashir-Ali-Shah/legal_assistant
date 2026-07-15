import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from '../common/ErrorBoundary';

export default function Layout() {
    return (
        <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ErrorBoundary>
    );
}

