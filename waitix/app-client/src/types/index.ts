export type UserRole = 'client' | 'waiter';

export type EventType = 'concert' | 'restaurant' | 'sneakers' | 'ambassade' | 'prefecture' | 'produit' | 'autre';

export type MissionStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'refunded' | 'failed';

export type NotificationType = 'mission_new' | 'mission_accepted' | 'mission_started' | 'mission_completed' | 'mission_cancelled' | 'payment' | 'system';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface WaiterProfile {
  user_id: string;
  is_online: boolean;
  is_available: boolean;
  iban?: string;
  stripe_account_id?: string;
  kyc_verified: boolean;
  rating_avg: number;
  missions_count: number;
  total_earned: number;
  latitude?: number;
  longitude?: number;
  last_location_update?: string;
  bio?: string;
  specialties: string[];
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  client_id: string;
  waiter_id?: string;
  location_name: string;
  location_address?: string;
  location_lat: number;
  location_lng: number;
  event_type: EventType;
  start_time: string;
  duration_minutes: number;
  price_client: number;
  price_waiter: number;
  commission: number;
  status: MissionStatus;
  waiter_position?: number;
  client_rating?: number;
  client_comment?: string;
  created_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
}

export interface Message {
  id: string;
  mission_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  mission_id: string;
  stripe_payment_intent_id?: string;
  stripe_transfer_id?: string;
  amount_client: number;
  amount_waiter: number;
  amount_commission: number;
  status: PaymentStatus;
  created_at: string;
  captured_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  data: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface PricingTier {
  duration_minutes: number;
  price_client: number;
  price_waiter: number;
  commission: number;
}

export const PRICING: PricingTier[] = [
  { duration_minutes: 30, price_client: 8, price_waiter: 6.40, commission: 1.60 },
  { duration_minutes: 60, price_client: 15, price_waiter: 12, commission: 3 },
  { duration_minutes: 90, price_client: 22, price_waiter: 17.60, commission: 4.40 },
  { duration_minutes: 120, price_client: 28, price_waiter: 22.40, commission: 5.60 },
  { duration_minutes: 150, price_client: 35, price_waiter: 28, commission: 7 },
  { duration_minutes: 180, price_client: 41, price_waiter: 32.80, commission: 8.20 },
  { duration_minutes: 210, price_client: 47, price_waiter: 37.60, commission: 9.40 },
  { duration_minutes: 240, price_client: 53, price_waiter: 42.40, commission: 10.60 },
];
