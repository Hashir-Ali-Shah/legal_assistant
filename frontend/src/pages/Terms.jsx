import Card from '../components/common/Card';

export default function Terms() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-serif font-bold mb-4">
                    Terms of Service
                </h1>
                <p className="text-gray-600 mb-8">
                    Last updated: December 22, 2025
                </p>

                <Card className="prose prose-sm max-w-none">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using Lexa, you accept and agree to be bound by the terms and
                        provision of this agreement. If you do not agree to these terms, please do not use
                        this service.
                    </p>

                    <h2>2. Use License</h2>
                    <p>
                        Permission is granted to temporarily access Lexa for personal, non-commercial use.
                        This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul>
                        <li>Modify or copy the materials</li>
                        <li>Use the materials for any commercial purpose</li>
                        <li>Attempt to decompile or reverse engineer any software</li>
                        <li>Remove any copyright or other proprietary notations</li>
                    </ul>

                    <h2>3. Disclaimer</h2>
                    <p>
                        Lexa provides legal information, NOT legal advice. The information provided by
                        Lexa should not be used as a substitute for competent legal advice from a
                        licensed professional attorney.
                    </p>

                    <h2>4. User Content</h2>
                    <p>
                        You retain all rights to any content you submit, upload, or display on Lexa.
                        By submitting content, you grant us a license to use, store, and display that
                        content for the purpose of providing the service.
                    </p>

                    <h2>5. Privacy</h2>
                    <p>
                        Your use of Lexa is also governed by our Privacy Policy. Please review our
                        Privacy Policy to understand our practices.
                    </p>

                    <h2>6. Limitations</h2>
                    <p>
                        Lexa shall not be liable for any damages arising out of the use or inability
                        to use the service, even if Lexa has been notified of the possibility of such
                        damages.
                    </p>

                    <h2>7. Modifications</h2>
                    <p>
                        Lexa may revise these terms of service at any time without notice. By using
                        this service, you agree to be bound by the current version of these terms.
                    </p>

                    <h2>8. Governing Law</h2>
                    <p>
                        These terms shall be governed by and construed in accordance with the laws of
                        the jurisdiction in which Lexa operates.
                    </p>

                    <h2>Contact</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at legal@lexa.ai
                    </p>
                </Card>
            </div>
        </div>
    );
}
