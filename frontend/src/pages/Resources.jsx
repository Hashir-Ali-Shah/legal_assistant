import { Book, Scale, Gavel, Shield } from 'lucide-react';
import Card from '../components/common/Card';

export default function Resources() {
    const resources = [
        {
            category: 'Constitutional & Basic Laws',
            icon: <Scale className="w-6 h-6 text-primary-600" />,
            items: [
                { title: 'Constitution of the Islamic Republic of Pakistan', description: 'The supreme law of Pakistan.' },
                { title: 'Pakistan Penal Code (PPC)', description: 'The main criminal code of Pakistan.' },
            ],
        },
        {
            category: 'Procedural Codes',
            icon: <Gavel className="w-6 h-6 text-primary-600" />,
            items: [
                { title: 'Code of Civil Procedure, 1908', description: 'Procedural law relating to the administration of civil proceedings.' },
                { title: 'Code of Criminal Procedure, 1898', description: 'The main legislation on the procedure for administration of substantive criminal law.' },
            ],
        },
        {
            category: 'Special Laws',
            icon: <Shield className="w-6 h-6 text-primary-600" />,
            items: [
                { title: 'Prevention of Electronic Crimes Act, 2016 (PECA)', description: 'Legislation dealing with cybercrimes and electronic offenses.' },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <Book className="w-16 h-16 mx-auto mb-4 text-primary-600" />
                    <h1 className="text-5xl font-serif font-bold mb-4 text-gray-900">
                        Legal Knowledge Base
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Our AI legal assistant is trained on the following authoritative legal texts and procedural codes.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-1">
                    {resources.map((category, index) => (
                        <Card key={index} className="overflow-hidden">
                            <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex items-center gap-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    {category.icon}
                                </div>
                                <h2 className="text-2xl font-serif font-bold text-gray-900">
                                    {category.category}
                                </h2>
                            </div>
                            <div className="p-6">
                                <ul className="space-y-4">
                                    {category.items.map((item, itemIndex) => (
                                        <li 
                                            key={itemIndex}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 mt-1">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        * These documents are used as reference material for the AI to generate responses.
                    </p>
                </div>
            </div>
        </div>
    );
}
