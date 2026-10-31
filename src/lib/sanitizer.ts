/**
 * ARTIFICIAL CRAFT - SECURITY SANITIZER UTILITY
 * Màng lọc an toàn 2 chiều cho Studio Configurator
 */

// 1. Lọc văn bản đầu vào do người dùng nhập (XSS / Prompt Injection Guard)
export function sanitizeUserInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Xóa thẻ <script>
    .replace(/on\w+="[^"]*"/gi, '')                                      // Xóa event inline (onload, onclick)
    .replace(/javascript:/gi, '')                                         // Xóa URI javascript:
    .trim();
}

// 2. Lọc chuỗi HTML từ AI trước khi bơm vào <iframe srcdoc="...">
export function sanitizeFrameHTML(htmlString: string): string {
  if (!htmlString) return '';

  let sanitized = htmlString;

  // Triệt tiêu các lệnh truy cập trái phép lên trang mẹ (Parent Window Escaping)
  sanitized = sanitized.replace(/window\.parent/g, 'window.self');
  sanitized = sanitized.replace(/window\.top/g, 'window.self');
  sanitized = sanitized.replace(/top\.location/g, 'self.location');
  sanitized = sanitized.replace(/document\.cookie/g, '""');

  return sanitized;
}
