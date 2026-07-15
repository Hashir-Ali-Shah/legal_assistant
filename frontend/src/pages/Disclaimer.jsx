import { AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';

export default function Disclaimer() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                    <h1 className="text-5xl font-serif font-bold mb-4">
                        Legal Disclaimer
                    </h1>
                    <p className="text-xl text-gray-600">
                        Important information about using Lexa
                    </p>
                </div>

                <Card className="bg-yellow-50 border-yellow-200 mb-6">
                    <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        Not Legal Advice
                    </h2>
                    <p className="text-gray-800 font-medium">
                        Lexa provides legal <strong>INFORMATION</strong>, NOT legal <strong>ADVICE</strong>.
                        The information and responses provided are for general informational purposes only
                        and should not be relied upon as professional legal counsel.
                    </p>
                </Card>

                <Card className="prose prose-sm max-w-none">
                    <h2>1. No Attorney-Client Relationship</h2>
                    <p>
                        Use of Lexa does not create an attorney-client relationship between you and
                        Lexa or any of its operators. The information provided should not be construed
                        as legal advice.
                    </p>

                    <h2>2. Accuracy and Completeness</h2>
                    <p>
                        While we strive to provide accurate and up-to-date information, Lexa makes no
                        warranties or representations about the accuracy, completeness, or reliability of
                        the information provided. Legal information can become outdated or may not apply
                        to your specific situation.
                    </p>

                    <h2>3. AI Limitations</h2>
                    <p>
                        Lexa uses artificial intelligence to generate responses. While our AI is trained
                        on legal documents, it may:
                    </p>
                    <ul>
                        <li>Misinterpret complex legal concepts</li>
                        <li>Provide outdated information</li>
                        <li>Miss jurisdiction-specific nuances</li>
                        <li>Generate responses that need verification</li>
                    </ul>

                    <h2>4. Consult a Licensed Attorney</h2>
                    <p>
                        For specific legal advice tailored to your situation, you should consult a licensed
                        attorney in your jurisdiction. Legal matters can be complex and fact-specific,
                        requiring professional judgment that AI cannot provide.
                    </p>

                    <h2>5. No Liability</h2>
                    <p>
                        To the fullest extent permitted by law, Lexa and its operators shall not be liable
                        for any direct, indirect, incidental, consequential, or punitive damages arising from
                        your use of the service or reliance on any information provided.
                    </p>

                    <h2>6. Jurisdiction-Specific Information</h2>
                    <p>
                        Laws vary by jurisdiction. Information provided by Lexa may not be applicable to
                        your specific jurisdiction or situation. Always verify legal information with local
                        laws and regulations.
                    </p>

                    <h2>7. Time-Sensitive Matters</h2>
                    <p>
                        Do not rely on Lexa for time-sensitive legal matters. Legal deadlines and statutes
                        of limitations can be critical. Contact a lawyer immediately if you have a time-sensitive
                        legal issue.
                    </p>

                    <h2>8. User Responsibility</h2>
                    <p>
                        You are responsible for:
                    </p>
                    <ul>
                        <li>Verifying any information you receive</li>
                        <li>Seeking professional legal counsel when needed</li>
                        <li>Understanding that AI responses are not guaranteed to be accurate</li>
                        <li>Making informed decisions about your legal matters</li>
                    </ul>

                    <h2>9. Confidentiality</h2>
                    <p>
                        Communications with Lexa are not protected by attorney-client privilege. Do not
                        share sensitive or confidential information that you would not want to be discoverable
                        in legal proceedings.
                    </p>

                    <div className="bg-gray-100 p-4 rounded-lg mt-6">
                        <p className="font-bold mb-2">Summary:</p>
                        <p>
                            Lexa is a helpful tool for understanding legal concepts and finding information,
                            but it is NOT a substitute for professional legal advice. Always consult a licensed
                            attorney for legal matters that affect your rights and obligations.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
