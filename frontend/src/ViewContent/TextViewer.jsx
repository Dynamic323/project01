import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { vsDark } from 'prism-react-renderer/themes/vsDark';

export function TextViewer({ content, type, title }) {
  const isCode = type === 'code';

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>

      <div className="p-6">
        {isCode ? (
          <SyntaxHighlighter
            language="javascript"
            style={vsDark}
            className="rounded-lg overflow-auto"
          >
            {content}
          </SyntaxHighlighter>
        ) : (
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
