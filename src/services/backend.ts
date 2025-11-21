// src/services/backend.ts
import { apiRequest } from './api';

export type HealthResponse = {
  status?: string;
  detail?: string;
  message?: string;
  [key: string]: unknown;
};

export type AdminUser = {
  id: string;
  email: string;
  role: string; // 'tenant' | 'admin' | 'owner' | etc.
  phone: string;
  is_active: boolean;
  created_at: string; // ISO timestamp
};

export type AdminUsersResponse = {
  users: AdminUser[];
  total_users: number;
};

export type PropertiesMetrics = {
  status_code: number;
  data: {
    total_listings: number;
    pending: number;
    approved: number;
    rejected: number;
    total_revenue: string; // decimal as string
  };
};

// Properties list item
export type PropertyItem = {
  id: string;
  title: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | string;
  owner_id: string;
  price: number;
  lat?: number | null;
  lon?: number | null;
};

export type PaymentMetrics = {
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
};

export type UserReportResponse = {
  title: string;
  data: Record<string, unknown> & {
    total_users?: number;
    new_users_month?: number;
    active_users?: number;
  };
};

// Try GET /health first (common FastAPI pattern). If it fails, try GET /
export async function getHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const data = await apiRequest<HealthResponse>('/health', { method: 'GET' });
    return { ok: true, data };
  } catch (e1: any) {
    try {
      const data = await apiRequest<HealthResponse>('/', { method: 'GET' });
      return { ok: true, data };
    } catch (e2: any) {
      return { ok: false, error: e2?.message || e1?.message || 'Health check failed' };
    }
  }
}

// Example of a protected endpoint pattern (to be filled incrementally)
export async function getProtectedExample(): Promise<unknown> {
  return apiRequest('/api/example', { method: 'GET' });
}

// Admin: List users with pagination via skip/limit
export async function getAdminUsers({ skip = 0, limit = 10 }: { skip?: number; limit?: number }): Promise<AdminUsersResponse> {
  const qs = new URLSearchParams({ skip: String(skip), limit: String(limit) }).toString();
  return apiRequest<AdminUsersResponse>(`/api/v1/admin/users?${qs}`, { method: 'GET' });
}

// Admin service health checks
export async function getAdminCoreHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const data = await apiRequest<HealthResponse>(`/api/v1/admin/health`, { method: 'GET' });
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Admin health failed' };
  }
}

export async function getAdminAiHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const data = await apiRequest<HealthResponse>(`/api/v1/admin/ai/health`, { method: 'GET' });
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'AI health failed' };
  }
}

export async function getAdminPaymentsHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const data = await apiRequest<HealthResponse>(`/api/v1/admin/payments/health`, { method: 'GET' });
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Payments health failed' };
  }
}

export async function getAdminSearchHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string }> {
  try {
    const data = await apiRequest<HealthResponse>(`/api/v1/admin/search/health`, { method: 'GET' });
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Search health failed' };
  }
}

// Properties metrics
export async function getPropertiesMetrics(): Promise<PropertiesMetrics> {
  return apiRequest<PropertiesMetrics>(`/api/v1/admin/properties/metrics`, { method: 'GET' });
}

// List properties
export async function listProperties(): Promise<PropertyItem[]> {
  return apiRequest<PropertyItem[]>(`/api/v1/admin/properties`, { method: 'GET' });
}

// Approve property
export async function approveProperty(propertyId: string): Promise<{ status: string }> {
  return apiRequest<{ status: string }>(`/api/v1/admin/properties/${propertyId}/approve`, { method: 'POST' });
}

// Payment service metrics (non-auth proxy per docs)
export async function getPaymentMetrics(): Promise<PaymentMetrics> {
  return apiRequest<PaymentMetrics>(`/api/v1/admin/payments/metrics`, { method: 'GET' });
}

// User report
export async function getUserReport(lang: 'en' | 'am' = 'en'): Promise<UserReportResponse> {
  const qs = new URLSearchParams({ lang }).toString();
  return apiRequest<UserReportResponse>(`/api/v1/admin/reports/users?${qs}`, { method: 'GET' });
}

// Export report
export async function exportReport(type: 'users', lang: 'en' | 'am' = 'en'): Promise<{ file_url: string }> {
  const qs = new URLSearchParams({ lang }).toString();
  return apiRequest<{ file_url: string }>(`/api/v1/admin/reports/export/${type}?${qs}`, { method: 'GET' });
}
