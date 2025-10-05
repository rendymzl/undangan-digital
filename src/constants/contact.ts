/**
 * Contact information and support constants
 */

// Email addresses
export const EMAIL_ADDRESSES = {
  ADMIN: 'admin@menantikan.com',
  SUPPORT: 'support@menantikan.com',
  INFO: 'info@menantikan.com',
  NOREPLY: 'noreply@menantikan.com',
} as const;

// Phone numbers
export const PHONE_NUMBERS = {
  SUPPORT: '+62-xxx-xxxx-xxxx',
  OFFICE: '+62-xxx-xxxx-xxxx',
} as const;

// Social media
export const SOCIAL_MEDIA = {
  INSTAGRAM: 'https://instagram.com/menantikan',
  FACEBOOK: 'https://facebook.com/menantikan',
  TWITTER: 'https://twitter.com/menantikan',
  YOUTUBE: 'https://youtube.com/menantikan',
  TIKTOK: 'https://tiktok.com/@menantikan',
} as const;

// Company information
export const COMPANY_INFO = {
  NAME: 'Menantikan',
  FULL_NAME: 'PT Menantikan Digital Indonesia',
  TAGLINE: 'Platform Undangan Digital Terbaik',
  DESCRIPTION: 'Buat undangan pernikahan digital yang indah dan mudah dibagikan',
  ADDRESS: 'Jakarta, Indonesia',
  WEBSITE: 'https://menantikan.com',
} as const;

// Support information
export const SUPPORT_INFO = {
  HOURS: 'Senin - Jumat, 09:00 - 17:00 WIB',
  RESPONSE_TIME: '1-2 hari kerja',
  LANGUAGES: ['Bahasa Indonesia', 'English'],
} as const;

// Email templates
export const EMAIL_TEMPLATES = {
  ACCESS_REQUEST: {
    SUBJECT: 'Permintaan Akses - Menantikan',
    ADMIN_SUBJECT: 'Permintaan Akses Admin - Menantikan',
  },
  ERROR_REPORT: {
    SUBJECT: 'Laporan Error - Menantikan App',
  },
  SUPPORT: {
    SUBJECT: 'Bantuan - Menantikan',
  },
} as const;

// Helper functions
export const createMailtoLink = (
  email: string,
  subject?: string,
  body?: string
): string => {
  const params = new URLSearchParams();
  if (subject) params.append('subject', subject);
  if (body) params.append('body', body);
  
  const queryString = params.toString();
  return `mailto:${email}${queryString ? `?${queryString}` : ''}`;
};

export const createSupportEmail = (
  subject: string,
  body: string,
  userInfo?: {
    userId?: string;
    email?: string;
    role?: string;
  }
): string => {
  let emailBody = body;
  
  if (userInfo) {
    emailBody += '\n\n--- Informasi Pengguna ---\n';
    if (userInfo.userId) emailBody += `User ID: ${userInfo.userId}\n`;
    if (userInfo.email) emailBody += `Email: ${userInfo.email}\n`;
    if (userInfo.role) emailBody += `Role: ${userInfo.role}\n`;
    emailBody += `Waktu: ${new Date().toLocaleString('id-ID')}\n`;
    emailBody += `URL: ${window.location.href}\n`;
    emailBody += `User Agent: ${navigator.userAgent}\n`;
  }
  
  return createMailtoLink(EMAIL_ADDRESSES.SUPPORT, subject, emailBody);
};