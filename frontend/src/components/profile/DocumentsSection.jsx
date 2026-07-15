import { FileText, Upload } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function DocumentsSection() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">Documents</h1>
                <p className="text-gray-600">Manage your uploaded legal documents</p>
            </div>

            <Card>
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-serif font-bold mb-2">Document Library</h3>
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
        </>
    );
}
