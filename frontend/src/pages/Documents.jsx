import { FileText, Upload } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function Documents() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold mb-2">
                        Documents
                    </h1>
                    <p className="text-gray-600">
                        Manage your uploaded legal documents
                    </p>
                </div>

                {/* Empty State (for MVP) */}
                <Card>
                    <div className="text-center py-16">
                        <FileText className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-2xl font-serif font-bold mb-2">
                            Document Library
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Upload and manage your legal documents here.
                            Documents are automatically processed during chat sessions.
                        </p>
                        <div className="text-sm text-gray-500 mb-6">
                            <p>Supported formats: PDF, DOCX, TXT</p>
                            <p>Maximum file size: 10MB</p>
                        </div>
                        <Button icon={<Upload className="w-4 h-4" />}>
                            Upload Document
                        </Button>
                        <p className="text-sm text-gray-500 mt-4">
                            Tip: You can also upload documents directly in the chat interface
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
