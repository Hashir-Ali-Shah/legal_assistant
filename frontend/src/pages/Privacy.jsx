import Card from '../components/common/Card';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-serif font-bold mb-4">
                    Privacy Policy
                </h1>
                <p className="text-gray-600 mb-8">
                    Last updated: December 22, 2025
                </p>

                <Card className="prose prose-sm max-w-none">
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information that you provide directly to us, including:
                    </p>
                    <ul>
                        <li>Account information (name, email)</li>
                        <li>Chat messages and queries</li>
                        <li>Uploaded documents</li>
                        <li>Usage data and preferences</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul>
                        <li>Provide, maintain, and improve our services</li>
                        <li>Process and respond to your queries</li>
                        <li>Send you technical notices and support messages</li>
                        <li>Analyze usage patterns to improve the service</li>
                    </ul>

                    <h2>3. Data Storage</h2>
                    <p>
                        Your chat history and preferences are stored locally in your browser using
                        localStorage. Uploaded documents are processed temporarily and not permanently
                        stored on our servers.
                    </p>

                    <h2>4. Information Sharing</h2>
                    <p>
                        We do not sell, trade, or rent your personal information to third parties.
                        We may share information only in the following circumstances:
                    </p>
                    <ul>
                        <li>With your consent</li>
                        <li>To comply with legal obligations</li>
                        <li>To protect our rights and safety</li>
                    </ul>

                    <h2>5. Security</h2>
                    <p>
                        We take reasonable measures to protect your information from unauthorized access,
                        alteration, or destruction. However, no internet transmission is completely secure.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>
                        You have the right to:
                    </p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to data processing</li>
                    </ul>

                    <h2>7. Cookies and Tracking</h2>
                    <p>
                        We use browser localStorage to store your preferences and session information.
                        This data remains on your device and can be cleared at any time.
                    </p>

                    <h2>8. Children's Privacy</h2>
                    <p>
                        Our service is not intended for users under 18 years of age. We do not knowingly
                        collect information from children.
                    </p>

                    <h2>9. Changes to This Policy</h2>
                    <p>
                        We may update this privacy policy from time to time. We will notify you of any
                        changes by posting the new policy on this page.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact us at privacy@lawbot.com
                    </p>
                </Card>
            </div>
        </div>
    );
}
