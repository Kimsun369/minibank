import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Download, ArrowRight } from 'lucide-react';
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
      if (!user) {
        throw new Error('User information is not available');
      }

      if (!account) {
        throw new Error('Account information is not available');
      }

      if (!transactions || transactions.length === 0) {
        throw new Error('No transactions available to generate PDF');
      }

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
      icon: Plus,
      label: 'Deposit',
      path: '/deposit',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      gradient: 'from-blue-50 to-blue-100',
      isLink: true,
    },
    {
      icon: Minus,
      label: 'Withdraw',
      path: '/withdraw',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      gradient: 'from-red-50 to-red-100',
      isLink: true,
    },
    {
      icon: Download,
      label: 'Statement',
      path: '#',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      gradient: 'from-purple-50 to-purple-100',
      isLink: false,
      onClick: handleDownloadClick,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {actions.map((action, index) => {
          const Icon = action.icon;

          if (action.isLink) {
            return (
              <Link
                key={action.label}
                to={action.path}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-6 flex flex-col items-center text-center">
                  <div className={`${action.bgColor} p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <p className="font-bold text-slate-800">{action.label}</p>
                  <p className="text-xs text-slate-400 mt-1">Quick access</p>
                  <ArrowRight className="w-3 h-3 text-slate-400 mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            );
          }

          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              disabled={isGeneratingPDF}
            >
              <div className="relative p-6 flex flex-col items-center text-center">
                <div className={`${action.bgColor} p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <p className="font-bold text-slate-800">{action.label}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                </p>
                <Download className="w-3 h-3 text-slate-400 mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300" />
              </div>
            </button>
          );
        })}
      </div>

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