import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();

export function PdfViewer({ url, title }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        {/* <h1 className="text-2xl font-bold text-white">{title}</h1> */}
      </div>

      <div className="p-6 bg-gray-900">
        <div className="mb-4 flex justify-center">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="shadow-lg"
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              className="shadow-md"
            />
          </Document>
        </div>

        {numPages && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
              disabled={pageNumber >= numPages}
              className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
