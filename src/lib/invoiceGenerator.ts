import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, differenceInDays } from 'date-fns';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface InvoiceData {
  // Booking details
  bookingId: string;
  apartmentType: string;
  apartmentName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  discountAmount?: number;
  promoCode?: string;
  pricePerNight: number;

  // Guest details
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  guestAddress?: string;
  guestIdNumber?: string;

  // Payment
  paymentStatus: string;
  paymentMethod?: string;

  // Meta
  createdAt: string;
  invoiceNumber?: string;
}

// Company details
const COMPANY = {
  name: 'ი.მ თამარ მახარაძე',
  nameEn: 'IE Tamar Makharadze',
  taxId: '01026011205',
  address: 'Sherif Khimshiashvili Street 7B, Orbi City',
  city: 'Batumi, Georgia',
  phone: '+995 555 19 90 90',
  email: 'orbi.apartments1@gmail.com',
  website: 'orbicitybatumi.com',
  bankName: 'Bank of Georgia',
  bankAccount: 'GE00BG0000000000000000', // Placeholder - update with real IBAN
};

export const generateInvoicePDF = (data: InvoiceData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Calculate nights
  const nights = differenceInDays(new Date(data.checkOut), new Date(data.checkIn));

  // Generate invoice number if not provided
  const invoiceNumber = data.invoiceNumber || `INV-${format(new Date(data.createdAt), 'yyyyMMdd')}-${data.bookingId.slice(0, 8).toUpperCase()}`;

  // Colors
  const primaryColor: [number, number, number] = [26, 54, 93]; // Navy
  const goldColor: [number, number, number] = [212, 175, 55]; // Gold
  const textColor: [number, number, number] = [51, 51, 51];

  // Header background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Gold accent line
  doc.setFillColor(...goldColor);
  doc.rect(0, 45, pageWidth, 2, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ORBI CITY', 20, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('BATUMI', 20, 28);

  // Invoice title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 20, 20, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`#${invoiceNumber}`, pageWidth - 20, 28, { align: 'right' });
  doc.text(`Date: ${format(new Date(), 'dd/MM/yyyy')}`, pageWidth - 20, 35, { align: 'right' });

  // Reset text color
  doc.setTextColor(...textColor);

  // Two column layout for company and guest info
  const col1X = 20;
  const col2X = pageWidth / 2 + 10;
  let currentY = 60;

  // Company info (FROM)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...goldColor);
  doc.text('FROM:', col1X, currentY);
  doc.setTextColor(...textColor);

  currentY += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(COMPANY.name, col1X, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Tax ID: ${COMPANY.taxId}`, col1X, currentY);

  currentY += 5;
  doc.text(COMPANY.address, col1X, currentY);

  currentY += 5;
  doc.text(COMPANY.city, col1X, currentY);

  currentY += 5;
  doc.text(`Tel: ${COMPANY.phone}`, col1X, currentY);

  currentY += 5;
  doc.text(`Email: ${COMPANY.email}`, col1X, currentY);

  // Guest info (BILL TO)
  let guestY = 60;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...goldColor);
  doc.text('BILL TO:', col2X, guestY);
  doc.setTextColor(...textColor);

  guestY += 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(data.guestName || 'Guest', col2X, guestY);

  guestY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  if (data.guestIdNumber) {
    doc.text(`ID: ${data.guestIdNumber}`, col2X, guestY);
    guestY += 5;
  }

  if (data.guestEmail) {
    doc.text(data.guestEmail, col2X, guestY);
    guestY += 5;
  }

  if (data.guestPhone) {
    doc.text(`Tel: ${data.guestPhone}`, col2X, guestY);
    guestY += 5;
  }

  if (data.guestAddress) {
    const addressLines = doc.splitTextToSize(data.guestAddress, 70);
    doc.text(addressLines, col2X, guestY);
    guestY += addressLines.length * 5;
  }

  // Booking details box
  currentY = Math.max(currentY, guestY) + 15;

  doc.setFillColor(245, 245, 245);
  doc.roundedRect(20, currentY, pageWidth - 40, 25, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  const boxY = currentY + 10;
  doc.text('Booking ID:', 25, boxY);
  doc.text('Check-in:', 70, boxY);
  doc.text('Check-out:', 115, boxY);
  doc.text('Nights:', 160, boxY);

  doc.setFont('helvetica', 'normal');
  doc.text(data.bookingId.slice(0, 8).toUpperCase(), 25, boxY + 8);
  doc.text(format(new Date(data.checkIn), 'dd/MM/yyyy'), 70, boxY + 8);
  doc.text(format(new Date(data.checkOut), 'dd/MM/yyyy'), 115, boxY + 8);
  doc.text(String(nights), 160, boxY + 8);

  currentY += 35;

  // Services table
  const subtotal = data.pricePerNight * nights;
  const discount = data.discountAmount || 0;
  const total = data.totalPrice || (subtotal - discount);

  const tableData = [
    [
      data.apartmentName || data.apartmentType,
      `${nights} night${nights > 1 ? 's' : ''}`,
      `${data.guests} guest${data.guests > 1 ? 's' : ''}`,
      `$${data.pricePerNight.toFixed(2)}`,
      `$${subtotal.toFixed(2)}`
    ]
  ];

  doc.autoTable({
    startY: currentY,
    head: [['Description', 'Duration', 'Guests', 'Rate/Night', 'Amount']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  });

  // Get final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Totals section
  const totalsX = pageWidth - 80;
  let totalsY = finalY;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Subtotal:', totalsX, totalsY);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 25, totalsY, { align: 'right' });

  if (discount > 0) {
    totalsY += 8;
    doc.setTextColor(34, 139, 34); // Green for discount
    doc.text(`Discount${data.promoCode ? ` (${data.promoCode})` : ''}:`, totalsX, totalsY);
    doc.text(`-$${discount.toFixed(2)}`, pageWidth - 25, totalsY, { align: 'right' });
    doc.setTextColor(...textColor);
  }

  // Total line
  totalsY += 5;
  doc.setDrawColor(...goldColor);
  doc.setLineWidth(0.5);
  doc.line(totalsX - 10, totalsY, pageWidth - 20, totalsY);

  totalsY += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TOTAL:', totalsX, totalsY);
  doc.setTextColor(...primaryColor);
  doc.text(`$${total.toFixed(2)}`, pageWidth - 25, totalsY, { align: 'right' });
  doc.setTextColor(...textColor);

  // Payment status badge
  totalsY += 12;
  const statusColor: [number, number, number] = data.paymentStatus === 'paid'
    ? [34, 139, 34] // Green
    : data.paymentStatus === 'pending'
      ? [255, 165, 0] // Orange
      : [220, 53, 69]; // Red

  doc.setFillColor(...statusColor);
  doc.roundedRect(totalsX - 10, totalsY - 5, 70, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const statusText = data.paymentStatus === 'paid' ? 'PAID' : data.paymentStatus.toUpperCase();
  doc.text(statusText, pageWidth - 55, totalsY + 2, { align: 'center' });
  doc.setTextColor(...textColor);

  // Bank details (if unpaid)
  if (data.paymentStatus !== 'paid') {
    totalsY += 25;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...goldColor);
    doc.text('BANK DETAILS FOR PAYMENT:', 20, totalsY);
    doc.setTextColor(...textColor);

    totalsY += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`Bank: ${COMPANY.bankName}`, 20, totalsY);
    totalsY += 5;
    doc.text(`Account: ${COMPANY.bankAccount}`, 20, totalsY);
    totalsY += 5;
    doc.text(`Reference: ${invoiceNumber}`, 20, totalsY);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;

  doc.setDrawColor(...goldColor);
  doc.setLineWidth(0.5);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);

  doc.text('Thank you for choosing Orbi City Batumi!', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`${COMPANY.website} | ${COMPANY.email} | ${COMPANY.phone}`, pageWidth / 2, footerY + 5, { align: 'center' });
  doc.text('Luxury Sea View Apartments in the Heart of Batumi', pageWidth / 2, footerY + 10, { align: 'center' });

  return doc;
};

export const downloadInvoice = (data: InvoiceData): void => {
  const doc = generateInvoicePDF(data);
  const invoiceNumber = data.invoiceNumber || `INV-${format(new Date(data.createdAt), 'yyyyMMdd')}-${data.bookingId.slice(0, 8).toUpperCase()}`;
  doc.save(`${invoiceNumber}.pdf`);
};

export const getInvoiceBlob = (data: InvoiceData): Blob => {
  const doc = generateInvoicePDF(data);
  return doc.output('blob');
};

export const getInvoiceBase64 = (data: InvoiceData): string => {
  const doc = generateInvoicePDF(data);
  return doc.output('datauristring');
};
