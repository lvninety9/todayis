/**
 * Publish System Types
 * 
 * 초대장 공개 시스템 위한 타입 정의
 * - Invitation: 공개된 초대장
 * - InvitationData: 초대장 필드 데이터
 */

/**
 * 공개된 초대장
 */
export interface Invitation {
  /** 고유 식별자 */
  id: string;
  /** 소유자 사용자 ID */
  user_id: string;
  /** 템플릿 ID */
  template_id: string;
  /** 공개 URL slug */
  slug: string;
  /** 초대장 제목 */
  title: string;
  /** 템플릿 필드 값 매핑 (field.name -> value) */
  data: Record<string, string>;
  /** 레이아웃 설정 */
  layout: Record<string, unknown>;
  /** 공개 여부 */
  is_published: boolean;
  /** 생성일시 */
  created_at: string;
  /** 수정일시 */
  updated_at: string;
}

/**
 * DB 삽입용 Invitation
 */
export interface InvitationInsert {
  user_id: string;
  template_id: string;
  slug: string;
  title: string;
  data: Record<string, string>;
  layout: Record<string, unknown>;
  is_published?: boolean;
}

/**
 * 공개/비공개 토글 요청/응답
 */
export interface InvitationPublishToggle {
  is_published: boolean;
}

/**
 * 공개 초대장 조회 API 응답
 */
export interface PublicInvitationResponse {
  invitation: Invitation;
  template: {
    id: string;
    name: string;
    category: string;
  };
}

/**
 * Slug 생성 요청
 */
export interface SlugGenerate {
  userId: string;
  templateId: string;
  title: string;
}
