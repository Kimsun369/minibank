import { jsPDF } from 'jspdf';

const getTransactionsFromLast30Days = (transactions) => {
  if (!Array.isArray(transactions)) {
    return [];
  }
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return transactions.filter(tx => {
    if (!tx || !tx.date) return false;
    const txDate = new Date(tx.date);
    return txDate >= thirtyDaysAgo && txDate <= now;
  });
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.warn('Invalid date format:', date);
    return 'N/A';
  }
};

const safeString = (value, fallback = 'N/A') => {
  if (value === null || value === undefined) return fallback;
  return String(value).trim() || fallback;
};

const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

export const generateTransactionsPDF = async (user, account, transactions) => {
  try {
    // Validate required data
    if (!user) {
      throw new Error('User information is not available');
    }
    if (!account) {
      throw new Error('Account information is not available');
    }
    if (!Array.isArray(transactions)) {
      throw new Error('Transaction data is not available');
    }

    const filteredTransactions = getTransactionsFromLast30Days(transactions);

    if (filteredTransactions.length === 0) {
      throw new Error('No transactions found in the last 30 days');
    }

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Colors (safe RGB values)
    const primaryColor = [12, 61, 102];
    const accentColor = [15, 122, 165];
    const textColor = [51, 51, 51];

    // ===== HEADER SECTION =====
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Transaction Report', margin, 20);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on ${formatDate(new Date())}`, margin, 32);

    yPosition = 50;

    // ===== USER & ACCOUNT SECTION =====
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Account Information', margin, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const accountHolder = safeString(user.full_name || user.name, 'N/A');
    doc.text(`Account Holder: ${accountHolder}`, margin, yPosition);
    yPosition += 6;
    
    const accountId = safeString(account.id, 'N/A');
    doc.text(`Account ID: ${accountId}`, margin, yPosition);
    yPosition += 6;
    
    const accountType = safeString(account.type, 'Checking');
    doc.text(`Account Type: ${accountType}`, margin, yPosition);
    yPosition += 6;

    // ===== BALANCE SUMMARY SECTION =====
    yPosition += 6;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition - 4, contentWidth, 20, 'F');

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Current Balance', margin + 5, yPosition + 2);

    const balance = safeNumber(account.balance, 0) / 100;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    const balanceText = `$${balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    doc.text(balanceText, margin + 5, yPosition + 12);

    yPosition += 26;

    // ===== TRANSACTION HISTORY SECTION =====
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...textColor);
    doc.text(`Transaction History (Last 30 Days - ${filteredTransactions.length} transactions)`, margin, yPosition);

    yPosition += 10;

    // ===== TABLE HEADER =====
    const columnWidths = {
      date: 30,
      description: 60,
      category: 35,
      type: 25,
      amount: 35,
    };

    doc.setFillColor(...accentColor);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');

    const tableHeaderY = yPosition;
    doc.rect(margin, tableHeaderY - 4, contentWidth, 7, 'F');

    let xPos = margin + 2;
    doc.text('Date', xPos, tableHeaderY);
    xPos += columnWidths.date;
    doc.text('Description', xPos, tableHeaderY);
    xPos += columnWidths.description;
    doc.text('Category', xPos, tableHeaderY);
    xPos += columnWidths.category;
    doc.text('Type', xPos, tableHeaderY);
    xPos += columnWidths.type;
    doc.text('Amount', xPos, tableHeaderY);

    yPosition += 10;

    // ===== TABLE ROWS =====
    doc.setTextColor(...textColor);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);

    let rowCount = 0;
    const maxRowsPerPage = 20;

    for (const tx of filteredTransactions) {
      // Validate transaction data
      if (!tx) continue;

      // Check if we need a new page
      if (rowCount >= maxRowsPerPage && yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
        rowCount = 0;

        // Repeat table header on new page
        doc.setFillColor(...accentColor);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(9);
        doc.rect(margin, yPosition - 4, contentWidth, 7, 'F');

        xPos = margin + 2;
        doc.text('Date', xPos, yPosition);
        xPos += columnWidths.date;
        doc.text('Description', xPos, yPosition);
        xPos += columnWidths.description;
        doc.text('Category', xPos, yPosition);
        xPos += columnWidths.category;
        doc.text('Type', xPos, yPosition);
        xPos += columnWidths.type;
        doc.text('Amount', xPos, yPosition);

        yPosition += 10;
        doc.setTextColor(...textColor);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
      }

      // Alternate row background
      if (rowCount % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPosition - 3, contentWidth, 6, 'F');
      }

      // Add row data with safe fallbacks
      xPos = margin + 2;

      const formattedDate = formatDate(tx.date);
      doc.text(formattedDate, xPos, yPosition);

      xPos += columnWidths.date;
      const description = safeString(tx.description, 'N/A');
      const descriptionText = description.length > 30 
        ? description.substring(0, 27) + '...' 
        : description;
      doc.text(descriptionText, xPos, yPosition);

      xPos += columnWidths.description;
      const category = safeString(tx.category, 'other');
      const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);
      doc.text(categoryDisplay, xPos, yPosition);

      xPos += columnWidths.category;
      const txType = safeString(tx.type, 'debit');
      const typeDisplay = txType === 'credit' ? 'Credit' : 'Debit';
      const typeColor = txType === 'credit' ? [34, 197, 94] : [239, 68, 68];
      doc.setTextColor(...typeColor);
      doc.text(typeDisplay, xPos, yPosition);

      xPos += columnWidths.type;
      doc.setTextColor(...textColor);
      const amount = safeNumber(tx.amount, 0);
      const amountDisplay = `$${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      doc.text(amountDisplay, xPos, yPosition, { align: 'right' });

      yPosition += 6;
      rowCount++;
    }

    // ===== FOOTER =====
    yPosition = pageHeight - 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is an auto-generated transaction report from MiniBank', margin, yPosition);
    doc.text(`© ${new Date().getFullYear()} MiniBank`, pageWidth - margin - 30, yPosition);

    // Generate data URL
    const pdfDataUrl = doc.output('dataurlstring');
    return pdfDataUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
