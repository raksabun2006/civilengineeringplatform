/**
 * EngineerBiz Export Utilities
 * Provides seamless export to Excel (CSV with UTF-8 BOM for perfect Khmer & English rendering)
 * and print-ready PDF generation.
 */

import { EstimateResponse, QuotationResponse, InvoiceResponse, ProjectResponse } from '@/types/api';

/**
 * Downloads data as a CSV file with UTF-8 BOM so Microsoft Excel
 * properly renders Khmer characters without encoding corruption.
 */
export function downloadCsv(filename: string, csvContent: string): void {
  // Prepend \uFEFF BOM for Excel UTF-8 recognition
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvCell(cell: string | number | undefined | null): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Export BOQ (Bill of Quantities / Estimate) to Excel (.csv)
 */
export function exportBoqToExcel(boq: EstimateResponse, projectName?: string): void {
  const lines: string[] = [];

  // Header Section
  lines.push(['EngineerBiz – Bill of Quantities (BOQ) & Estimation'].map(escapeCsvCell).join(','));
  lines.push(['Project', projectName || boq.projectName || 'N/A'].map(escapeCsvCell).join(','));
  lines.push(['BOQ Code', boq.estimateCode].map(escapeCsvCell).join(','));
  lines.push(['BOQ Title', boq.title].map(escapeCsvCell).join(','));
  lines.push(['Status', boq.status].map(escapeCsvCell).join(','));
  lines.push(['Date', new Date(boq.createdAt).toLocaleDateString()].map(escapeCsvCell).join(','));
  lines.push(['Currency', boq.currency || 'USD'].map(escapeCsvCell).join(','));
  lines.push(''); // Blank separator

  // Summary Metrics
  lines.push(['FINANCIAL SUMMARY'].map(escapeCsvCell).join(','));
  lines.push(['Total Direct Cost', Number(boq.totalDirectCost || 0).toFixed(2)].map(escapeCsvCell).join(','));
  lines.push(['Total Indirect Cost', Number(boq.totalIndirectCost || 0).toFixed(2)].map(escapeCsvCell).join(','));
  lines.push(['Profit Margin (%)', `${boq.marginPercentage ?? boq.profitMarginRate ?? 0}%`].map(escapeCsvCell).join(','));
  lines.push(['Total Estimated Amount', Number(boq.totalEstimatedAmount || 0).toFixed(2)].map(escapeCsvCell).join(','));
  lines.push(''); // Blank separator

  // Items Table Header
  lines.push([
    'Item #',
    'Description (ការពិពណ៌នា)',
    'Unit (ឯកតា)',
    'Quantity (បរិមាណ)',
    'Unit Cost (តម្លៃឯកតា USD)',
    'Total Cost (សរុប USD)',
    'Notes (ចំណាំ)',
  ].map(escapeCsvCell).join(','));

  // Items Rows
  if (boq.items && boq.items.length > 0) {
    boq.items.forEach((item, idx) => {
      const code = item.itemNumber || item.itemCode || `${idx + 1}`;
      const desc = item.description || '';
      const unit = item.unit || item.unitOfMeasure || 'LS';
      const qty = item.quantity || 0;
      const rate = item.directCost || item.unitRateDirectCost || 0;
      const total = item.totalCost || item.subtotalDirectCost || (qty * rate);
      const notes = item.notes || '';

      lines.push([
        code,
        desc,
        unit,
        qty,
        Number(rate).toFixed(2),
        Number(total).toFixed(2),
        notes,
      ].map(escapeCsvCell).join(','));
    });
  }

  // Footer Total
  lines.push('');
  lines.push([
    'GRAND TOTAL',
    '',
    '',
    '',
    '',
    Number(boq.totalEstimatedAmount || 0).toFixed(2),
    '',
  ].map(escapeCsvCell).join(','));

  const filename = `BOQ_${boq.estimateCode}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsv(filename, lines.join('\r\n'));
}

/**
 * Export Quotation to Excel (.csv)
 */
export function exportQuotationToExcel(quote: QuotationResponse): void {
  const lines: string[] = [];

  lines.push(['EngineerBiz – Quotation'].map(escapeCsvCell).join(','));
  lines.push(['Quotation No', quote.quotationNumber || quote.quotationCode].map(escapeCsvCell).join(','));
  lines.push(['Project', quote.projectName || 'N/A'].map(escapeCsvCell).join(','));
  lines.push(['Client', quote.clientName || 'N/A'].map(escapeCsvCell).join(','));
  lines.push(['Issue Date', quote.issueDate].map(escapeCsvCell).join(','));
  lines.push(['Valid Until', quote.validUntil].map(escapeCsvCell).join(','));
  lines.push(['Status', quote.status].map(escapeCsvCell).join(','));
  lines.push('');

  lines.push([
    'Item #',
    'Description',
    'Unit',
    'Quantity',
    'Unit Price (USD)',
    'Subtotal (USD)',
  ].map(escapeCsvCell).join(','));

  if (quote.items && quote.items.length > 0) {
    quote.items.forEach((item, idx) => {
      const code = item.itemCode || `${idx + 1}`;
      const desc = item.description || '';
      const unit = item.unit || item.unitOfMeasure || 'LS';
      const qty = item.quantity || 0;
      const price = item.unitPrice || 0;
      const subtotal = item.subtotal || item.totalPrice || (qty * price);

      lines.push([
        code,
        desc,
        unit,
        qty,
        Number(price).toFixed(2),
        Number(subtotal).toFixed(2),
      ].map(escapeCsvCell).join(','));
    });
  }

  lines.push('');
  lines.push(['Subtotal Amount', '', '', '', '', Number(quote.subtotalAmount || quote.subtotal || 0).toFixed(2)].map(escapeCsvCell).join(','));
  lines.push(['Discount Amount', '', '', '', '', Number(quote.discountAmount || 0).toFixed(2)].map(escapeCsvCell).join(','));
  lines.push(['Tax Amount (VAT)', '', '', '', '', Number(quote.taxAmount || 0).toFixed(2)].map(escapeCsvCell).join(','));
  lines.push(['GRAND TOTAL', '', '', '', '', Number(quote.grandTotal || quote.totalAmount || 0).toFixed(2)].map(escapeCsvCell).join(','));

  const filename = `Quotation_${quote.quotationNumber || 'quote'}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsv(filename, lines.join('\r\n'));
}

/**
 * Export Invoice to Excel (.csv)
 */
export function exportInvoiceToExcel(invoice: InvoiceResponse): void {
  const lines: string[] = [];

  lines.push(['EngineerBiz – Tax Invoice'].map(escapeCsvCell).join(','));
  lines.push(['Invoice No', invoice.invoiceNumber].map(escapeCsvCell).join(','));
  lines.push(['Project', invoice.projectName || 'N/A'].map(escapeCsvCell).join(','));
  lines.push(['Type', invoice.invoiceType || invoice.type].map(escapeCsvCell).join(','));
  lines.push(['Issue Date', invoice.issueDate].map(escapeCsvCell).join(','));
  lines.push(['Due Date', invoice.dueDate].map(escapeCsvCell).join(','));
  lines.push(['Status', invoice.status].map(escapeCsvCell).join(','));
  lines.push('');

  lines.push([
    'Line #',
    'Description',
    'Quantity',
    'Unit Price (USD)',
    'Line Total (USD)',
  ].map(escapeCsvCell).join(','));

  if (invoice.items && invoice.items.length > 0) {
    invoice.items.forEach((item, idx) => {
      lines.push([
        idx + 1,
        item.itemDescription,
        item.quantity,
        Number(item.unitPrice).toFixed(2),
        Number(item.lineTotal).toFixed(2),
      ].map(escapeCsvCell).join(','));
    });
  }

  lines.push('');
  lines.push(['Total Amount', '', '', '', Number(invoice.totalAmount).toFixed(2)].map(escapeCsvCell).join(','));
  lines.push(['Paid Amount', '', '', '', Number(invoice.paidAmount).toFixed(2)].map(escapeCsvCell).join(','));
  lines.push(['Balance Due', '', '', '', Number(invoice.balanceDue).toFixed(2)].map(escapeCsvCell).join(','));

  const filename = `Invoice_${invoice.invoiceNumber}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsv(filename, lines.join('\r\n'));
}

/**
 * Printable PDF Trigger
 * Opens an isolated print preview window with company letterhead,
 * clean typography, tables, and signature blocks.
 */
export function printBoqPdf(boq: EstimateResponse, projectName?: string): void {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow popups to export printable PDF.');
    return;
  }

  const itemsHtml = (boq.items || [])
    .map(
      (item, idx) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #e2e8f0; font-family: monospace;">${item.itemNumber || item.itemCode || idx + 1}</td>
      <td style="padding: 8px; border: 1px solid #e2e8f0; font-weight: 500;">${item.description}</td>
      <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">${item.unit || item.unitOfMeasure || 'LS'}</td>
      <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right;">$${Number(item.directCost || item.unitRateDirectCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">$${Number(item.totalCost || item.subtotalDirectCost || (item.quantity * (item.directCost || item.unitRateDirectCost || 0))).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
    </tr>
  `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>BOQ_${boq.estimateCode}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kantumruy+Pro:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Kantumruy Pro', 'Inter', sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 30px;
      font-size: 12px;
      background: #fff;
    }
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #0f2342;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f2342;
    }
    .brand-subtitle {
      font-size: 9px;
      color: #64748b;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .doc-title {
      font-size: 16px;
      font-weight: 800;
      color: #0f2342;
      text-align: right;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      background: #f8fafc;
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }
    .meta-item {
      display: flex;
      gap: 8px;
    }
    .meta-label {
      font-weight: 600;
      color: #64748b;
      min-width: 90px;
    }
    .meta-value {
      font-weight: 600;
      color: #0f172a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #0f2342;
      color: #ffffff;
      padding: 8px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
    }
    .summary-box {
      margin-left: auto;
      width: 280px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px;
      background: #f8fafc;
      margin-bottom: 30px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }
    .summary-total {
      font-size: 14px;
      font-weight: 800;
      color: #1d4ed8;
      border-top: 1px solid #cbd5e1;
      padding-top: 6px;
      margin-top: 4px;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      padding-top: 20px;
    }
    .sig-box {
      text-align: center;
      width: 200px;
      border-top: 1px solid #94a3b8;
      padding-top: 8px;
      font-weight: 600;
      color: #475569;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">Engineer<span style="color: #f59e0b;">Biz</span></div>
      <div class="brand-subtitle">ENGINEERING & CONSTRUCTION MANAGEMENT</div>
      <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Phnom Penh, Kingdom of Cambodia</div>
    </div>
    <div>
      <div class="doc-title">BILL OF QUANTITIES (BOQ)</div>
      <div style="font-size: 11px; font-weight: 700; color: #f59e0b; text-align: right;">${boq.estimateCode}</div>
      <div style="font-size: 10px; color: #64748b; text-align: right;">Status: ${boq.status}</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><span class="meta-label">គម្រោង (Project):</span><span class="meta-value">${projectName || boq.projectName || 'Civil Infrastructure Project'}</span></div>
    <div class="meta-item"><span class="meta-label">កាលបរិច្ឆេទ (Date):</span><span class="meta-value">${new Date(boq.createdAt).toLocaleDateString()}</span></div>
    <div class="meta-item"><span class="meta-label">ចំណងជើង BOQ:</span><span class="meta-value">${boq.title}</span></div>
    <div class="meta-item"><span class="meta-label">រូបិយប័ណ្ណ (Currency):</span><span class="meta-value">${boq.currency || 'USD'}</span></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50px;">Item</th>
        <th>Description (ការពិពណ៌នាការងារ)</th>
        <th style="width: 60px; text-align: center;">Unit</th>
        <th style="width: 60px; text-align: right;">Qty</th>
        <th style="width: 100px; text-align: right;">Unit Cost</th>
        <th style="width: 110px; text-align: right;">Total Cost</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="summary-box">
    <div class="summary-row">
      <span>Total Direct Cost (ថ្លៃដើមផ្ទាល់):</span>
      <b>$${Number(boq.totalDirectCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
    </div>
    <div class="summary-row">
      <span>Total Indirect Cost (ថ្លៃប្រយោល):</span>
      <b>$${Number(boq.totalIndirectCost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
    </div>
    <div class="summary-row">
      <span>Profit Margin (ភាគរយចំណេញ):</span>
      <b>${boq.marginPercentage ?? boq.profitMarginRate ?? 0}%</b>
    </div>
    <div class="summary-row summary-total">
      <span>Grand Total (តម្លៃប៉ាន់ស្មានសរុប):</span>
      <span>$${Number(boq.totalEstimatedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
    </div>
  </div>

  <div class="signatures">
    <div class="sig-box">
      Prepared By (អ្នករៀបចំ)<br>
      <span style="font-size: 10px; font-weight: normal; color: #94a3b8;">Site Quantity Surveyor</span>
    </div>
    <div class="sig-box">
      Reviewed By (អ្នកពិនិត្យ)<br>
      <span style="font-size: 10px; font-weight: normal; color: #94a3b8;">Chief Project Engineer</span>
    </div>
    <div class="sig-box">
      Approved By (អ្នកអនុម័ត)<br>
      <span style="font-size: 10px; font-weight: normal; color: #94a3b8;">Managing Director</span>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
