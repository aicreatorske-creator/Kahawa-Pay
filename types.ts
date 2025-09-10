
export interface Creator {
  id: string;
  name: string;
  bio: string;
  profileImageUrl: string;
}

export interface StkPushResponse {
  success: boolean;
  message: string;
}

export enum PaymentStatus {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}
