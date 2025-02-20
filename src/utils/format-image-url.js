import { CONFIG } from 'src/config-global';

export function formatImageUrl(url) {
  if (!url) return '';
  
  // Если URL уже абсолютный (начинается с http:// или https://)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Если URL начинается с /uploads/
  if (url.startsWith('/uploads/')) {
    return `${CONFIG.site.serverUrl}${url}`;
  }

  // Для других относительных URL
  return `${CONFIG.site.serverUrl}${url}`;
}
