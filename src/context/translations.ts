export type Language = 'EN' | 'VI';

export interface Translations {
  heroTitleLine1: string;
  heroTitleLine2: string;
  subtitle: string;
  ctaButton: string;
  exportBlueprint: string;
}

export const translations: Record<Language, Translations> = {
  EN: {
    heroTitleLine1: 'ARTIFICIAL',
    heroTitleLine2: 'CRAFT',
    subtitle: 'Where Meticulous Graphic Design Meets Deterministic AI Automation.',
    ctaButton: 'Launch Autopilot Studio',
    exportBlueprint: 'Export HD Diagram',
  },
  VI: {
    heroTitleLine1: 'ARTIFICIAL',
    heroTitleLine2: 'CRAFT',
    subtitle: 'Nơi Thiết Kế Đồ Họa Tỉ Mẩn Gặp Tự Động Hóa AI Xác Định.',
    ctaButton: 'Kích Hoạt Autopilot Studio',
    exportBlueprint: 'Xuất Ảnh Sơ Đồ HD',
  },
};
