import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LayoutDashboard, FileText, HelpCircle, LogOut, BarChart3 } from 'lucide-react';
import { getInitials } from '../utils/helpers';

// Section Components
import ProfileSection from '../components/profile/ProfileSection';
import DashboardSection from '../components/profile/DashboardSection';
import DocumentsSection from '../components/profile/DocumentsSection';
import HelpSection from '../components/profile/HelpSection';
import UsageSection from '../components/profile/UsageSection';

export default function Profile() {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');

    const sidebarItems = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'usage', name: 'Usage', icon: BarChart3 },
        { id: 'documents', name: 'Documents', icon: FileText },
        { id: 'help', name: 'Help', icon: HelpCircle },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardSection onNavigate={setActiveSection} />;
            case 'usage':
                return <UsageSection />;
            case 'documents':
                return <DocumentsSection />;
            case 'help':
                return <HelpSection />;
            case 'profile':
            default:
                return <ProfileSection />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-white border-r-2 border-gray-200 p-4 flex-shrink-0">
                    {/* User Info */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {getInitials(user?.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-sm truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${activeSection === item.id
                                            ? 'bg-black text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{item.name}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-4xl">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}
