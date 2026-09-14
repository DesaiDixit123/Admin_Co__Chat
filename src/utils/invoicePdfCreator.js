/**
 * Pure client-side PDF-1.4 generator for ChatNest Invoices.
 * Exactly matches the mobile app invoice layout, brand styling, dynamic GST, and details.
 */

function escapePdfText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r/g, '')
    .replace(/\n/g, ' ');
}

export async function createClientInvoicePdfBlob(row, gstPercent = 18) {
  const sub = row?.subscription || {};
  const totalAmount = Number(sub.price || 0);
  const gstRate = Number(gstPercent || 18);
  const basePrice = totalAmount > 0 ? Math.round((totalAmount / (1 + gstRate / 100)) * 100) / 100 : 0;
  const gstAmount = Math.round((totalAmount - basePrice) * 100) / 100;

  const dateObj = sub.startDate || sub.activatedAt || row?.createdAt ? new Date(sub.startDate || sub.activatedAt || row?.createdAt) : new Date();
  const dateFormatted = dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ', ' + dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const dateStr = dateObj.toISOString().slice(0, 10).replace(/-/g, '');
  const shortId = (sub.paymentId || row?._id || 'ACTV').toString().slice(-4).toUpperCase();
  const invNum = escapePdfText(`INV-${dateStr}-${shortId}`);
  const planTitle = escapePdfText(sub.planTitle || 'ChatNest Membership');
  const duration = escapePdfText(sub.durationLabel || `${sub.durationDays || 30} Days`);
  const rawPayId = sub.paymentId || row?.paymentId || '';
  const cleanPayId = (rawPayId && rawPayId !== 'N/A' && rawPayId !== 'COMPLETED') ? rawPayId : `PAY-${dateStr}-${shortId}`;
  const payId = escapePdfText(cleanPayId);
  const payMethod = escapePdfText((sub.paymentMethod || 'RAZORPAY').toUpperCase());
  const currency = escapePdfText(sub.currency ? `${sub.currency} (Rs.)` : 'INR (Rs.)');
  const status = escapePdfText('PAID / COMPLETED');

  const customerName = escapePdfText(row?.fullname?.trim() || row?.nickname?.trim() || 'ChatNest Customer');
  let customerMobile = row?.mobile ? String(row.mobile).trim() : 'N/A';
  if (customerMobile !== 'N/A' && customerMobile.length === 10 && !customerMobile.startsWith('+')) {
    customerMobile = '+91 ' + customerMobile;
  }
  customerMobile = escapePdfText(customerMobile);
  const customerEmail = escapePdfText(row?.email || 'N/A');

  // Load logo as JPEG bytes via canvas
  let logoBytes = null;
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    // Import logo directly
    img.src = new URL('../assets/images/appLogo.png', import.meta.url).href;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve; // Continue even if logo fails to load
    });
    if (img.complete && img.naturalWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 256, 256);
      const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
      if (blob) {
        const ab = await blob.arrayBuffer();
        logoBytes = new Uint8Array(ab);
      }
    }
  } catch (e) {
    console.log('Logo load note:', e);
  }

  const hasLogo = logoBytes && logoBytes.length > 0;

  const chunks = [];
  const encoder = new TextEncoder();
  const write = (str) => chunks.push(encoder.encode(str));

  write('%PDF-1.4\n');
  const offsets = [];

  // 1: Catalog
  offsets.push(getTotalLength(chunks));
  write('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // 2: Pages
  offsets.push(getTotalLength(chunks));
  write('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // 3: Page
  offsets.push(getTotalLength(chunks));
  if (hasLogo) {
    write('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> /XObject << /Im1 7 0 R >> >> >>\nendobj\n');
  } else {
    write('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n');
  }

  // Build Content Stream
  let content = '';

  // 1. Header Banner (Brand Green: 0.113 0.725 0.329 rg)
  content += '0.113 0.725 0.329 rg\n';
  content += '0 730 595 112 re\n';
  content += 'f\n';

  if (hasLogo) {
    content += '1 1 1 rg\n';
    content += '40 750 52 52 re\n';
    content += 'f\n';
    content += 'q\n';
    content += '48 0 0 48 42 752 cm\n';
    content += '/Im1 Do\n';
    content += 'Q\n';

    content += '1 1 1 rg\n';
    content += 'BT /F2 22 Tf 104 782 Td (ChatNest) Tj ET\n';
    content += 'BT /F1 10 Tf 104 762 Td (Secure Messaging & Social Platform) Tj ET\n';
  } else {
    content += '1 1 1 rg\n';
    content += 'BT /F2 26 Tf 40 785 Td (ChatNest) Tj ET\n';
    content += 'BT /F1 11 Tf 40 765 Td (Secure Messaging & Social Platform) Tj ET\n';
  }

  content += '1 1 1 rg\n';
  content += 'BT /F2 15 Tf 410 782 Td (TAX INVOICE) Tj ET\n';
  content += 'BT /F1 9 Tf 410 765 Td (ORIGINAL FOR RECIPIENT) Tj ET\n';

  // 2. Invoice Meta Box
  content += '0.95 0.96 0.98 rg\n';
  content += '40 635 515 75 re\n';
  content += 'f\n';
  content += '0.85 0.88 0.91 RG 1 w\n';
  content += '40 635 515 75 re\n';
  content += 'S\n';

  // Meta Texts - Left Column
  content += '0.15 0.15 0.15 rg\n';
  content += `BT /F2 9 Tf 55 685 Td (INVOICE NO:) Tj ET\n`;
  content += `BT /F1 9 Tf 145 685 Td (${invNum}) Tj ET\n`;

  content += `BT /F2 9 Tf 55 665 Td (DATE:) Tj ET\n`;
  content += `BT /F1 9 Tf 145 665 Td (${dateFormatted}) Tj ET\n`;

  content += `BT /F2 9 Tf 55 645 Td (STATUS:) Tj ET\n`;
  content += '0.05 0.6 0.2 rg\n';
  content += `BT /F2 9 Tf 145 645 Td (${status}) Tj ET\n`;

  // Meta Texts - Right Column
  content += '0.15 0.15 0.15 rg\n';
  content += `BT /F2 9 Tf 320 685 Td (PAYMENT ID:) Tj ET\n`;
  content += `BT /F1 9 Tf 405 685 Td (${payId}) Tj ET\n`;

  content += `BT /F2 9 Tf 320 665 Td (METHOD:) Tj ET\n`;
  content += `BT /F1 9 Tf 405 665 Td (${payMethod}) Tj ET\n`;

  content += `BT /F2 9 Tf 320 645 Td (CURRENCY:) Tj ET\n`;
  content += `BT /F1 9 Tf 405 645 Td (${currency}) Tj ET\n`;

  // 3. Customer Info Section (BILLED TO)
  content += '0.2 0.2 0.2 rg\n';
  content += 'BT /F2 11 Tf 40 605 Td (BILLED TO:) Tj ET\n';
  content += `BT /F2 10 Tf 40 588 Td (${customerName}) Tj ET\n`;
  content += `BT /F1 9 Tf 40 572 Td (Mobile: ${customerMobile}   |   Email: ${customerEmail}) Tj ET\n`;

  // 4. Items Table Header
  content += '0.113 0.725 0.329 rg\n';
  content += '40 535 515 25 re\n';
  content += 'f\n';
  content += '1 1 1 rg\n';
  content += 'BT /F2 10 Tf 55 543 Td (ITEM / PLAN DESCRIPTION) Tj ET\n';
  content += 'BT /F2 10 Tf 310 543 Td (DURATION) Tj ET\n';
  content += 'BT /F2 10 Tf 440 543 Td (AMOUNT \\(INR\\)) Tj ET\n';

  // 5. Items Table Row
  content += '0.98 0.98 0.99 rg\n';
  content += '40 485 515 50 re\n';
  content += 'f\n';
  content += '0.88 0.88 0.88 RG 0.5 w\n';
  content += '40 485 515 50 re\n';
  content += 'S\n';

  content += '0.15 0.15 0.15 rg\n';
  content += `BT /F2 11 Tf 55 514 Td (${planTitle}) Tj ET\n`;
  content += 'BT /F1 9 Tf 55 496 Td (Full Access to ChatNest Premium Features) Tj ET\n';
  content += `BT /F1 10 Tf 310 505 Td (${duration}) Tj ET\n`;
  content += `BT /F2 11 Tf 440 505 Td (Rs. ${basePrice.toFixed(2)}) Tj ET\n`;

  // 6. Tax Summary Box
  content += '0.96 0.97 0.98 rg\n';
  content += '310 390 245 80 re\n';
  content += 'f\n';
  content += '0.85 0.88 0.91 RG 0.5 w\n';
  content += '310 390 245 80 re\n';
  content += 'S\n';

  content += '0.2 0.2 0.2 rg\n';
  content += 'BT /F1 10 Tf 325 446 Td (Base Price:) Tj ET\n';
  content += `BT /F2 10 Tf 440 446 Td (Rs. ${basePrice.toFixed(2)}) Tj ET\n`;

  content += `BT /F1 10 Tf 325 424 Td (GST \\(${gstRate}%\\):) Tj ET\n`;
  content += `BT /F2 10 Tf 440 424 Td (Rs. ${gstAmount.toFixed(2)}) Tj ET\n`;

  // Total Paid row (Green banner)
  content += '0.113 0.725 0.329 rg\n';
  content += '310 390 245 28 re\n';
  content += 'f\n';
  content += '1 1 1 rg\n';
  content += 'BT /F2 11 Tf 325 399 Td (TOTAL PAID:) Tj ET\n';
  content += `BT /F2 12 Tf 440 399 Td (Rs. ${totalAmount.toFixed(2)}) Tj ET\n`;

  // 7. Terms & Conditions
  content += '0.85 0.88 0.91 RG 0.5 w\n';
  content += '40 140 515 0 re\n';
  content += 'S\n';

  content += '0.3 0.3 0.3 rg\n';
  content += 'BT /F2 9 Tf 40 120 Td (Terms & Conditions:) Tj ET\n';
  content += 'BT /F1 8 Tf 40 106 Td (1. Membership plans are activated immediately upon successful payment confirmation.) Tj ET\n';
  content += 'BT /F1 8 Tf 40 94 Td (2. Subscription fees are non-refundable once the plan has been activated.) Tj ET\n';
  content += 'BT /F1 8 Tf 40 82 Td (3. This is a computer-generated tax invoice and requires no physical signature.) Tj ET\n';

  content += '0.113 0.725 0.329 rg\n';
  content += 'BT /F2 10 Tf 170 45 Td (Thank you for choosing ChatNest Premium!) Tj ET\n';

  const contentBytes = encoder.encode(content);

  // 4: Content Stream
  offsets.push(getTotalLength(chunks));
  write(`4 0 obj\n<< /Length ${contentBytes.length} >>\nstream\n`);
  chunks.push(contentBytes);
  write('\nendstream\nendobj\n');

  // 5: Font F1
  offsets.push(getTotalLength(chunks));
  write('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  // 6: Font F2
  offsets.push(getTotalLength(chunks));
  write('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');

  // 7: Image XObject (if logo exists)
  if (hasLogo) {
    offsets.push(getTotalLength(chunks));
    write(`7 0 obj\n<< /Type /XObject /Subtype /Image /Width 256 /Height 256 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBytes.length} >>\nstream\n`);
    chunks.push(logoBytes);
    write('\nendstream\nendobj\n');
  }

  // Cross-reference table
  const startXref = getTotalLength(chunks);
  const numObjects = hasLogo ? 8 : 7;
  write(`xref\n0 ${numObjects}\n`);
  write('0000000000 65535 f \n');
  for (let i = 0; i < offsets.length; i++) {
    write(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }

  write('trailer\n');
  write(`<< /Size ${numObjects} /Root 1 0 R >>\n`);
  write('startxref\n');
  write(`${startXref}\n`);
  write('%%EOF\n');

  return new Blob(chunks, { type: 'application/pdf' });
}

function getTotalLength(chunks) {
  let len = 0;
  for (let i = 0; i < chunks.length; i++) {
    len += chunks[i].length;
  }
  return len;
}
