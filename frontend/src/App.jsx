import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import About from './pages/About'
import Resources from './pages/Resources'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Disclaimer from './pages/Disclaimer'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'

function App() {
    return (
        <AuthProvider>
            <ChatProvider>
                <Router>
                    <ScrollToTop />
                    <Routes>
                        {/* Admin routes (no layout) */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminDashboard />} />

                        {/* Main app routes (with layout) */}
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route
                                path="/chat"
                                element={
                                    <ProtectedRoute>
                                        <Chat />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/about" element={<About />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/disclaimer" element={<Disclaimer />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </Router>
            </ChatProvider>
        </AuthProvider>
    )
}

export default App

