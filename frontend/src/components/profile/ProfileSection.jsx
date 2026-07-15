import { User, Mail, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { formatDate, getInitials } from '../../utils/helpers';

export default function ProfileSection() {
    const { user, logout } = useAuth();

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">Profile</h1>
                <p className="text-gray-600">Manage your account information and settings</p>
            </div>

            {/* Profile Info */}
            <Card className="mb-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
                        {getInitials(user?.name)}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-2xl font-bold truncate">{user?.name}</h2>
                        <p className="text-gray-600 truncate">{user?.email}</p>
                    </div>
                </div>

                <div className="space-y-4 border-t-2 border-gray-100 pt-6">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm text-gray-600">Full Name</p>
                            <p className="font-medium truncate">{user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium truncate">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-medium">{formatDate(user?.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Settings */}
            <Card className="mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Settings
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive updates via email</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <p className="font-medium">Voice Input</p>
                            <p className="text-sm text-gray-600">Enable microphone for voice queries</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium">Auto-scroll</p>
                            <p className="text-sm text-gray-600">Automatically scroll to new messages</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card>
                <h3 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h3>
                <Button variant="danger" onClick={logout} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </Card>
        </>
    );
}
