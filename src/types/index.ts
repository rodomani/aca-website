// ==========================================
// 1. STORE & PRODUCTS
// ==========================================

export type ProductCategory = 
  | 'CERTIFICATE'   // 민간자격증2급, 수료증1, 2, 3
  | 'CLASS'         // 정샘네, 조보연, 김보리 원데이 클라스
  | 'MATERIAL'      // 교재 2권, 수업티키트
  | 'SERVICE';      // 해외구매대행

export interface StoreItem {
  id: string;
  title: string;
  category: ProductCategory;
  description: string;
  price?: number; 
  instructor?: string;   // Specific to 'CLASS' category
  smartStoreUrl: string; // External link for purchase
  imageUrl?: string;
}

// ==========================================
// 2. NOTICES & ANNOUNCEMENTS
// ==========================================

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string; // ISO 8601 string recommended (e.g., "2026-08-01T09:00:00Z")
  isPinned?: boolean;  // To keep important notices at the top
}

// ==========================================
// 3. RESEARCH
// ==========================================

export interface ResearchArticle {
  id: string;
  title: string;
  abstract: string;
  author: string;
  publishDate: string;
  pdfUrl?: string;     // Link to download the full research paper if applicable
}

// ==========================================
// 4. ARCHIVE (POSTERS)
// ==========================================

export interface ArchiveItem {
  id: string;
  title: string;
  eventDate: string;
  imageUrl: string;
  description?: string;
}