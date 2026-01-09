import QRCode from 'qrcode';

class QRService {
  async generateQRCode(data: string): Promise<string> {
    try {
      // Generate QR code as base64 data URL
      const qrCodeDataUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      return qrCodeDataUrl;
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }

  async generateQRCodeForPurchase(purchaseId: string, userId: string, showId: string): Promise<string> {
    // Create a unique string for the QR code
    const qrData = JSON.stringify({
      purchaseId,
      userId,
      showId,
      timestamp: new Date().toISOString(),
    });
    return this.generateQRCode(qrData);
  }
}

export default new QRService();

