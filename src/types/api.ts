// API Response Types
export interface PaymentMetrics {
  status_code: number;
  data: {
    total_payments: number;
    pending_payments: number;
    success_payments: number;
    failed_payments: number;
    webhook_calls: number;
    initiate_calls: number;
    status_calls: number;
    timeout_jobs_run: number;
    total_revenue: number;
  };
}

export interface PropertyMetrics {
  total_properties: number;
  active_properties: number;
  pending_approval: number;
}

export interface UserReportResponse {
  total_users: number;
  active_users: number;
  new_users: number;
}

export interface PropertyItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  // Add other property fields as needed
}

export interface AdminUsersResponse {
  users: Array<{
    id: string;
    email: string;
    is_active: boolean;
    created_at: string;
  }>;
  total: number;
}

export interface PublicPropertiesResponse {
  properties: PropertyItem[];
  total: number;
  offset: number;
  limit: number;
}

export interface HealthResponse {
  status: string;
  version?: string;
  timestamp?: string;
  details?: Record<string, unknown>;
}
