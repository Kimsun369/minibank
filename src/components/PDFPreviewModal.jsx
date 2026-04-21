import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, Loader } from "lucide-react";

const PDFPreviewModal = ({
  isOpen,
  pdfDataUrl,
  onConfirm,
  onCancel,
  isGenerating = false,
  error = null,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Manage animation state and body scroll
  useEffect(() => {
    if (isOpen) {
      // Trigger animation with small delay
      const timer = setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isGenerating && !isDownloading) {
      onCancel();
    }
  };

  const handleConfirmDownload = () => {
    setIsDownloading(true);
    try {
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = pdfDataUrl;
      link.download = "transactions.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Call onConfirm callback
      setTimeout(() => {
        setIsDownloading(false);
        onConfirm();
      }, 500);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setIsDownloading(false);
    }
  };

  // Render modal using React Portal
  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out ${
        isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Transaction Report Preview
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Review your report before downloading
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={isGenerating || isDownloading}
            className="p-2 hover:bg-primary-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-neutral-700" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-neutral-50 to-neutral-100">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
                <div>
                  <p className="text-neutral-900 font-semibold text-lg">
                    Generating PDF...
                  </p>
                  <p className="text-neutral-600 text-sm mt-2">
                    Please wait while we prepare your report
                  </p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-6">
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center max-w-md w-full">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-red-800 font-bold mb-2 text-lg">
                  Error Generating PDF
                </p>
                <p className="text-red-700 text-sm mb-4">{error}</p>
                <button
                  onClick={onCancel}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          ) : pdfDataUrl ? (
            <iframe
              src={pdfDataUrl}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-600 text-lg">No PDF to display</p>
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-4 p-6 border-t border-neutral-200 bg-gradient-to-r from-neutral-50 to-neutral-100">
          <button
            onClick={onCancel}
            disabled={isGenerating || isDownloading}
            className="px-6 py-3 text-neutral-700 bg-neutral-200 hover:bg-neutral-300 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDownload}
            disabled={isGenerating || isDownloading || !pdfDataUrl || error}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg hover:shadow-xl"
          >
            {isDownloading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Confirm Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render outside the component tree
  const modalRoot = document.getElementById("modal-root");
  if (!isOpen || !modalRoot) return null;

  return createPortal(modalContent, modalRoot);
};

export default PDFPreviewModal;
