import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CompanyReport } from '../types';

export function extractDomain(website?: string): string {
  if (!website || website === 'N/A') return '';
  try {
    const formatted = website.startsWith('http') ? website : `https://${website}`;
    const parsed = new URL(formatted);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

export function fetchAndConvertToDataUrl(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 128;
        canvas.height = img.naturalHeight || 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    setTimeout(() => resolve(null), 2500);
    img.src = url;
  });
}

export function generateInitialLogoDataUrl(companyName: string): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const grad = ctx.createLinearGradient(0, 0, 128, 128);
    grad.addColorStop(0, '#2563eb');
    grad.addColorStop(1, '#4f46e5');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const initial = (companyName.trim().charAt(0) || 'C').toUpperCase();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initial, 64, 68);

    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
}

export async function getLogoDataUrl(website?: string, companyName?: string): Promise<string> {
  const domain = extractDomain(website);

  if (domain) {
    const candidateUrls = [
      `https://logo.clearbit.com/${domain}`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    ];

    for (const url of candidateUrls) {
      try {
        const dataUrl = await fetchAndConvertToDataUrl(url);
        if (dataUrl) return dataUrl;
      } catch {
        // continue
      }
    }
  }

  return generateInitialLogoDataUrl(companyName || 'C');
}

export async function generateCompanyReportPDF(
  report: CompanyReport,
  providedLogoDataUrl?: string
): Promise<{ doc: jsPDF; filename: string; base64: string }> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let currentY = 15;

  // Fetch or generate logo
  const logoDataUrl = providedLogoDataUrl || (await getLogoDataUrl(report.website, report.companyName));

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('COMPANY RESEARCH & AI INTELLIGENCE REPORT', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`Generated on: ${new Date(report.timestamp).toLocaleString()}  |  AI Model: ${report.modelUsed}`, margin, 22);

  currentY = 34;

  // Title & Company Name with Logo Icon
  if (logoDataUrl) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, currentY, 15, 15, 3, 3, 'FD');
      doc.addImage(logoDataUrl, 'PNG', margin + 1, currentY + 1, 13, 13);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(report.companyName, margin + 19, currentY + 10);

      currentY += 21;
    } catch {
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text(report.companyName, margin, currentY + 6);
      currentY += 12;
    }
  } else {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(report.companyName, margin, currentY + 6);
    currentY += 12;
  }

  const pdfAddress =
    report.address &&
    !report.address.startsWith('http') &&
    !report.address.startsWith('www.') &&
    !/\b[a-z0-9-]+\.(com|in|org|net)\b/i.test(report.address)
      ? report.address
      : 'N/A';

  // Overview Table / Details Grid
  autoTable(doc, {
    startY: currentY,
    head: [['Field', 'Information']],
    body: [
      ['Official Website', report.website || 'N/A'],
      ['Phone Number', report.phoneNumber || 'N/A'],
      ['Address / HQ', pdfAddress],
      ['Analyzed Pages', `${report.rawCrawledPagesCount} web pages discovered & crawled`],
      ['Global Footprint', report.globalWebFootprint || 'Regional / International'],
      ['Estimated Workforce', report.employeeCountEstimate || 'N/A'],
      ['Tech Stack', (report.techStack || ['HTML5', 'React', 'Cloud Services']).join(', ')],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: contentWidth - 45 },
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Section: Company Executive Summary
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. COMPANY EXECUTIVE SUMMARY', margin + 3, currentY + 5);

  currentY += 11;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  const summaryLines = doc.splitTextToSize(report.summary, contentWidth);
  doc.text(summaryLines, margin, currentY);
  currentY += summaryLines.length * 5 + 6;

  // Check page height before section 2
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  // Section: Products & Services
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. CORE PRODUCTS & SERVICES', margin + 3, currentY + 5);

  currentY += 11;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  if (report.productsServices && report.productsServices.length > 0) {
    report.productsServices.forEach((item) => {
      const bulletLines = doc.splitTextToSize(`• ${item}`, contentWidth - 4);
      if (currentY + bulletLines.length * 4.5 > 270) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(bulletLines, margin + 2, currentY);
      currentY += bulletLines.length * 4.5 + 2;
    });
  } else {
    doc.text('No specific product details identified.', margin + 2, currentY);
    currentY += 6;
  }

  currentY += 4;

  // Check page height before section 3
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Section: AI-Generated Pain Points
  doc.setFillColor(254, 242, 242); // red-50
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(153, 27, 27); // red-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. AI-IDENTIFIED PAIN POINTS & OPERATIONAL CHALLENGES', margin + 3, currentY + 5);

  currentY += 11;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);

  if (report.painPoints && report.painPoints.length > 0) {
    report.painPoints.forEach((painPoint, idx) => {
      const painLines = doc.splitTextToSize(`${idx + 1}. ${painPoint}`, contentWidth - 4);
      if (currentY + painLines.length * 4.5 > 270) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(painLines, margin + 2, currentY);
      currentY += painLines.length * 4.5 + 3;
    });
  } else {
    doc.text('No specific pain points generated.', margin + 2, currentY);
    currentY += 6;
  }

  currentY += 4;

  // Check page height before section 4
  if (currentY > 210) {
    doc.addPage();
    currentY = 20;
  }

  // Section: Competitor Analysis
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. COMPETITOR ANALYSIS', margin + 3, currentY + 5);

  currentY += 10;

  const competitorRows = (report.competitors || []).map((comp) => [
    comp.name || 'Unknown',
    comp.website || 'N/A',
    comp.country || comp.industry || 'Global / Same Industry',
    comp.summary || 'Direct market competitor',
  ]);

  if (competitorRows.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Competitor Name', 'Website', 'Region / Category', 'Market Overview']],
      body: competitorRows,
      theme: 'striped',
      headStyles: {
        fillColor: [51, 65, 85],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [51, 65, 85],
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 35 },
        1: { cellWidth: 45 },
        2: { cellWidth: 35 },
        3: { cellWidth: contentWidth - 115 },
      },
      margin: { left: margin, right: margin },
    });
    currentY = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.text('No key competitors identified.', margin + 2, currentY);
    currentY += 8;
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Company Intelligence Report • ${report.companyName} • Page ${i} of ${pageCount}`,
      margin,
      287
    );
  }

  const safeName = report.companyName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const filename = `${safeName}_research_report.pdf`;

  // Get base64 string
  const pdfOutput = doc.output('datauristring');
  const base64 = pdfOutput.split(',')[1] || '';

  return { doc, filename, base64 };
}

export async function downloadPDFReport(report: CompanyReport, providedLogoDataUrl?: string) {
  const { doc, filename } = await generateCompanyReportPDF(report, providedLogoDataUrl);
  doc.save(filename);
}
