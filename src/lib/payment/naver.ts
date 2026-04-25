/**
 * Naver Selling Page Client
 *
 * Naver Selling Page redirect 방식 연동
 * - 클라이언트: redirectToNaverSellingPage()로 네이버 판매 페이지로 이동
 * - 구매 완료 후 returnUrl로 복귀
 *
 * 흐름:
 * 1. 클라이언트: redirectToNaverSellingPage({ templateName, price, returnUrl }) → 네이버 판매 페이지
 * 2. 네이버: 구매 완료 후 returnUrl로 리다이렉트
 */

const NAVER_SELLING_PAGE_URL = process.env.NEXT_PUBLIC_NAVER_SELLING_PAGE_URL || 'https://sell smartstore.naver.com';

/**
 * Naver Selling Page 주문 정보
 */
export interface NaverOrder {
  templateName: string;
  price: number;
  templateId?: string;
  userId?: string;
}

/**
 * Naver Selling Page로 리다이렉트
 *
 * @param order - 주문 정보
 * @param returnUrl - 구매 완료 후 복귀 URL
 */
export function redirectToNaverSellingPage(order: NaverOrder, returnUrl: string): void {
  // 네이버 판매 페이지 URL 구성
  const url = new URL(NAVER_SELLING_PAGE_URL);

  // 쿼리 파라미터 추가 (템플릿 정보)
  url.searchParams.set('productName', order.templateName);
  url.searchParams.set('price', String(order.price));

  if (order.templateId) {
    url.searchParams.set('templateId', order.templateId);
  }

  // 복귀 URL
  const fullReturnUrl = new URL(returnUrl, window.location.origin);
  fullReturnUrl.searchParams.set('template', order.templateId || '');
  fullReturnUrl.searchParams.set('status', 'completed');
  url.searchParams.set('returnUrl', fullReturnUrl.toString());

  // 리다이렉트
  window.location.href = url.toString();
}

/**
 * Naver Selling Page URL 생성 (URL만 생성, 리다이렉트 안함)
 *
 * @param order - 주문 정보
 * @param returnUrl - 구매 완료 후 복귀 URL
 * @returns 생성된 URL 문자열
 */
export function getNaverSellingPageUrl(order: NaverOrder, returnUrl: string): string {
  const url = new URL(NAVER_SELLING_PAGE_URL);

  url.searchParams.set('productName', order.templateName);
  url.searchParams.set('price', String(order.price));

  if (order.templateId) {
    url.searchParams.set('templateId', order.templateId);
  }

  const fullReturnUrl = new URL(returnUrl, window.location.origin);
  fullReturnUrl.searchParams.set('template', order.templateId || '');
  fullReturnUrl.searchParams.set('status', 'completed');
  url.searchParams.set('returnUrl', fullReturnUrl.toString());

  return url.toString();
}

/**
 * 구매 완료 상태 파싱 (returnUrl에서)
 */
export interface PurchaseStatus {
  status: 'completed' | 'cancelled' | 'failed';
  template?: string;
}

export function parsePurchaseStatus(searchParams: URLSearchParams): PurchaseStatus | null {
  const status = searchParams.get('status') as PurchaseStatus['status'] | null;
  if (!status) return null;

  return {
    status,
    template: searchParams.get('template') || undefined,
  };
}