'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UploadArea } from '@/components/UploadArea';
import { FileText, History, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRawSection, setShowRawSection] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to process');

      const data = await response.json();
      setResult(data.extractedText);
    } catch (error) {
      console.error(error);
      alert('Error processing document');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8 font-sans transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gemini OCR</h1>
          </div>
          <Link
            href="/history"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <History className="w-4 h-4" />
            History
          </Link>
        </header>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
          <UploadArea onFileSelect={handleFileSelect} isProcessing={isProcessing} />
        </div>

        {result && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="font-semibold text-gray-900 dark:text-white">Extracted Text</h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Raw Markdown'}
              </button>
            </div>
            <div className="p-6">
              <article className="prose prose-xl prose-blue max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ node, ...props }) => <span className="font-sans whitespace-pre-wrap" {...props} />,
                    pre: ({ node, ...props }) => <pre className="not-prose font-sans whitespace-pre-wrap bg-transparent p-0" {...props} />
                  }}
                >
                  {result}
                </ReactMarkdown>
              </article>

              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => setShowRawSection(!showRawSection)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>{showRawSection ? '▼' : '▶'}</span>
                  {showRawSection ? 'Hide' : 'Show'} Raw Markdown
                </button>

                {showRawSection && (
                  <div className="mt-4">
                    <pre className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
                      {result}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
