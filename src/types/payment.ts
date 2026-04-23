/**
 * Payment System Types
 * 
 * 결제 시스템 관련 타입 정의
 * - PaymentStatus: 결제 상태 enum
 * - Payment: 결제 행 (DB snake_case)
 * - PaymentInsert: DB 삽입용
 * - PaymentUpdate: DB 업데이트용
 * - PurchaseCheck: 구매 상태 확인용
 */

/**
 * 결제 상태 (TypeScript const enum)
 */
export const PaymentStatus = {
  PENDING: "PENDING",
  DONE: "DONE",
  CANCELED: "CANCELED",
  EXPIRED: "EXPIRED",
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

/**
 * 결제 행 타입 (PostgreSQL row)
 */
export interface Payment {
  /** UUID 식별자 */
  id: string;
  /** 사용자 ID (auth.users 참조) */
  user_id: string;
  /** 템플릿 ID (nullable) */
  template_id: string | null;
  /** 결제 금액 (원화) */
  amount: number;
  /** 결제 상태 */
  status: PaymentStatusType;
  /** Toss PaymentKey (UNIQUE) */
  payment_key: string | null;
  /** 생성일시 */
  created_at: string;
}

/**
 * 결제 삽입 타입 (생성 시)
 */
export interface PaymentInsert {
  /** UUID 식별자 (생략 시 자동 생성) */
  id?: string;
  /** 사용자 ID (auth.users 참조) */
  user_id: string;
  /** 템플릿 ID (nullable) */
  template_id: string | null;
  /** 결제 금액 (원화) */
  amount: number;
  /** 결제 상태 (기본값: PENDING) */
  status?: PaymentStatusType;
  /** Toss PaymentKey (nullable) */
  payment_key?: string | null;
  /** 생성일시 (생략 시 자동 설정) */
  created_at?: string;
}

/**
 * 결제 업데이트 타입 (수정 시)
 */
export interface PaymentUpdate {
  /** 결제 상태 */
  status?: PaymentStatusType;
  /** Toss PaymentKey */
  payment_key?: string | null;
  /** 템플릿 ID */
  template_id?: string | null;
}

/**
 * 템플릿 구매 여부 확인 타입
 */
export interface PurchaseCheck {
  /** 템플릿 ID */
  template_id: string;
  /** 구매 여부 */
  is_purchased: boolean;
}
