import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Plus, Minus, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBank } from '../context/BankContext';
import { generateTransactionsPDF } from '../lib/PDFExporter';
import PDFPreviewModal from './PDFPreviewModal';

const QuickActions = () => {
  const { user } = useAuth();
  const { account, transactions } = useBank();
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const handleDownloadClick = async (e) => {
    e.preventDefault();
    setShowPDFModal(true);
    setIsGeneratingPDF(true);
    setPdfError(null);
    setPdfDataUrl(null);

    try {
      // Validate data
      if (!user) {
        throw new Error('User information is not available');
      }

      if (!account) {
        throw new Error('Account information is not available');
      }

      if (!transactions || transactions.length === 0) {
        throw new Error('No transactions available to generate PDF');
      }

      // Generate PDF
      const dataUrl = await generateTransactionsPDF(user, account, transactions);
      setPdfDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError(error.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleModalClose = () => {
    setShowPDFModal(false);
    setPdfDataUrl(null);
    setPdfError(null);
  };

  const handleConfirmDownload = () => {
    handleModalClose();
  };

  const actions = [
    {
      icon: Send,
      label: 'Transfer',
      path: '/transfer',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      isLink: true,
    },
    {
      icon: Plus,
      label: 'Deposit',
      path: '/deposit',
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      isLink: true,
    },
    {
      icon: Minus,
      label: 'Withdraw',
      path: '/withdraw',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      isLink: true,
    },
    {
      icon: Download,
      label: 'Download',
      path: '#',
      color: 'text-neutral-600',
      bgColor: 'bg-neutral-50',
      isLink: false,
      onClick: handleDownloadClick,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          if (action.isLink) {
            return (
              <Link
                key={action.label}
                to={action.path}
                className="group card p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-smooth"
              >
                <div className={`${action.bgColor} p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <p className="font-semibold text-neutral-900">{action.label}</p>
                <p className="text-xs text-neutral-500 mt-1">Quick access</p>
              </Link>
            );
          }

          // Download button (not a link)
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className="group card p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-smooth disabled:opacity-50"
              disabled={isGeneratingPDF}
            >
              <div className={`${action.bgColor} p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <p className="font-semibold text-neutral-900">{action.label}</p>
              <p className="text-xs text-neutral-500 mt-1">Quick access</p>
            </button>
          );
        })}
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPDFModal}
        pdfDataUrl={pdfDataUrl}
        isGenerating={isGeneratingPDF}
        error={pdfError}
        onConfirm={handleConfirmDownload}
        onCancel={handleModalClose}
      />
    </>
  );
};

export default QuickActions;
