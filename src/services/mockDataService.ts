// Mock data service to read from and modify local JSON data
import userData from './user.json';
import propData from './prop.json';

// Define the shape of the imported JSON data
interface PropertyData {
  properties: Property[];
}

interface UserData {
  users: User[];
}

// Cast the imported JSON data to the correct types
const propertyData = propData as unknown as PropertyData;
const userDataTyped = userData as unknown as UserData;

// User data interface
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'TENANT' | 'OWNER' | 'ADMIN';
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// Property status type
export type PropertyStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESERVED' | 'DELETED';

// Property data interface
export interface Property {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  amenities: string[];
  photos: string[];
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  lat: number;
  lon: number;
  house_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number | null;
}

// Payment metrics interface
interface PaymentMetrics {
  total_payments: number;
  pending_payments: number;
  success_payments: number;
  failed_payments: number;
  total_revenue: number;
}

// Helper function to generate a unique ID
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Get current timestamp in ISO format
const getCurrentTimestamp = (): string => new Date().toISOString();

// ==================== USER OPERATIONS ====================

// Get all users with pagination and filtering
export const getMockUsers = async (
  page: number = 1,
  pageSize: number = 10,
  filters: Omit<Partial<User>, 'search'> & { search?: string } = {}
): Promise<{ users: User[]; total: number }> => {
  let filteredUsers = [...userDataTyped.users];

  // Apply filters if provided
  if (Object.keys(filters).length > 0) {
    filteredUsers = filteredUsers.filter(user => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === '') return true;
        return user[key as keyof User] === value;
      });
    });
  }

  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  return {
    users: paginatedUsers,
    total: filteredUsers.length,
  };
};

// Get user by ID
export const getMockUserById = async (id: string): Promise<User | undefined> => {
  return userDataTyped.users.find(user => user.id === id);
};

// Create a new user
export const createMockUser = async (userDataInput: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const newUser: User = {
    id: generateId(),
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
    ...userDataInput,
  };

  userDataTyped.users.push(newUser);
  return newUser;
};

// Update an existing user
export const updateMockUser = async (id: string, updates: Partial<Omit<User, 'id' | 'created_at'>>): Promise<User | undefined> => {
  const userIndex = userDataTyped.users.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    const updatedUser = {
      ...userDataTyped.users[userIndex],
      ...updates,
      updated_at: getCurrentTimestamp()
    };
    
    userDataTyped.users[userIndex] = updatedUser;
    return updatedUser;
  }
  
  return undefined;
};

// Delete a user
export const deleteMockUser = async (id: string): Promise<boolean> => {
  const initialLength = userDataTyped.users.length;
  userDataTyped.users = userDataTyped.users.filter(user => user.id !== id);
  return userDataTyped.users.length < initialLength;
};

// ==================== PROPERTY OPERATIONS ====================

// Get all properties with pagination and filtering
export const getMockProperties = async (
  page: number = 1,
  pageSize: number = 10,
  filters: Omit<Partial<Property>, 'search'> & { search?: string } = {}
): Promise<{ properties: Property[]; total: number }> => {
  // Make a deep copy of the properties to avoid mutating the original data
  let filteredProperties = JSON.parse(JSON.stringify(propertyData.properties));

  // Apply search filter if provided
  if (filters.search) {
    const searchTerm = filters.search.toString().toLowerCase();
    filteredProperties = filteredProperties.filter((property: Property) => {
      return (
        property.title?.toLowerCase().includes(searchTerm) ||
        property.location?.toLowerCase().includes(searchTerm) ||
        property.house_type?.toLowerCase().includes(searchTerm) ||
        property.status?.toLowerCase().includes(searchTerm) ||
        property.description?.toLowerCase().includes(searchTerm) ||
        property.price?.toString().includes(searchTerm)
      );
    });
  }

  // Apply other filters
  const { search: _, ...otherFilters } = filters;
  if (Object.keys(otherFilters).length > 0) {
    filteredProperties = filteredProperties.filter((property: Property) => {
      return Object.entries(otherFilters).every(([key, value]) => {
        if (value === undefined || value === '') return true;
        return property[key as keyof Property] === value;
      });
    });
  }

  // Get total count before pagination
  const total = filteredProperties.length;

  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + pageSize);

  // Ensure all properties have required fields
  const processedProperties = paginatedProperties.map((property: Property) => ({
    ...property,
    price: property.price || 0,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    status: property.status || 'PENDING',
    created_at: property.created_at || new Date().toISOString(),
  }));

  return {
    properties: processedProperties,
    total,
  };
};

// Get property by ID
export const getMockPropertyById = async (id: string): Promise<Property | undefined> => {
  return propertyData.properties.find(property => property.id === id);
};

// Create a new property
export const createMockProperty = async (
  propertyInput: Omit<Property, 'id' | 'created_at' | 'updated_at' | 'status'>
): Promise<Property> => {
  const newProperty: Property = {
    id: generateId(),
    status: 'PENDING',
    created_at: getCurrentTimestamp(),
    updated_at: getCurrentTimestamp(),
    ...propertyInput,
  };

  propertyData.properties.push(newProperty);
  return newProperty;
};

// Update an existing property
export const updateMockProperty = async (
  id: string,
  updates: Partial<Omit<Property, 'id' | 'created_at' | 'user_id'>>
): Promise<Property | undefined> => {
  const propertyIndex = propertyData.properties.findIndex(p => p.id === id);
  
  if (propertyIndex !== -1) {
    const updatedProperty = {
      ...propertyData.properties[propertyIndex],
      ...updates,
      updated_at: getCurrentTimestamp()
    };
    
    propertyData.properties[propertyIndex] = updatedProperty;
    return updatedProperty;
  }
  
  return undefined;
};

// Delete a property (soft delete by setting status to DELETED)
export const deleteMockProperty = async (id: string): Promise<boolean> => {
  const property = await getMockPropertyById(id);
  if (!property) return false;
  
  property.status = 'DELETED';
  property.updated_at = getCurrentTimestamp();
  return true;
};

// Get properties by user ID
export const getMockPropertiesByUserId = async (userId: string): Promise<Property[]> => {
  return propertyData.properties.filter(property => property.user_id === userId);
};

// Update property status
export const updatePropertyStatus = async (
  id: string,
  status: Property['status']
): Promise<Property | undefined> => {
  return updateMockProperty(id, { status });
};

// ==================== TENANT & PAYMENT MOCK DATA ====================

// Tenant data interface
export interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_id: string;
  lease_start: string;
  lease_end: string;
  rent_amount: number;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Payment data interface
export interface Payment {
  id: string;
  tenant_id: string;
  property_id: string;
  amount: number;
  payment_type: 'rent' | 'deposit' | 'late_fee' | 'other';
  status: 'completed' | 'pending' | 'failed';
  payment_date: string;
  created_at: string;
  updated_at: string;
}

// Generate mock tenants
export const getMockTenants = async (page: number = 1, pageSize: number = 10): Promise<{ tenants: Tenant[]; total: number }> => {
  const mockTenants: Tenant[] = Array.from({ length: 50 }, (_, i) => ({
    id: `TEN${1000 + i}`,
    first_name: ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Emma'][i % 8],
    last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8],
    email: `tenant${i}@example.com`,
    phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    property_id: `PROP${100 + (i % 10)}`,
    lease_start: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
    lease_end: new Date(Date.now() + Math.floor(365 + Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
    rent_amount: Math.floor(500 + Math.random() * 2000),
    status: (['active', 'pending', 'inactive'] as const)[Math.floor(Math.random() * 3)],
    created_at: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }));

  return {
    tenants: mockTenants.slice((page - 1) * pageSize, page * pageSize),
    total: mockTenants.length,
  };
};

// Generate mock payments
export const getMockPayments = async (page: number = 1, pageSize: number = 10, year: number = new Date().getFullYear()): Promise<{ payments: Payment[]; total: number }> => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const paymentTypes = ['rent', 'deposit', 'late_fee', 'other'] as const;
  const statuses = ['completed', 'pending', 'failed'] as const;
  
  const mockPayments: Payment[] = [];
  let id = 1000;
  
  // Generate payments for each month
  for (const month of months) {
    // Generate 5-15 payments per month
    const paymentsThisMonth = 5 + Math.floor(Math.random() * 10);
    for (let i = 0; i < paymentsThisMonth; i++) {
      const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
      const amount = paymentType === 'rent' 
        ? 1000 + Math.floor(Math.random() * 2000) 
        : paymentType === 'deposit' 
          ? 500 + Math.floor(Math.random() * 1000)
          : 10 + Math.floor(Math.random() * 100);
      
      mockPayments.push({
        id: `PAY${id++}`,
        tenant_id: `TEN${1000 + Math.floor(Math.random() * 50)}`,
        property_id: `PROP${100 + Math.floor(Math.random() * 20)}`,
        amount,
        payment_type: paymentType,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        payment_date: new Date(year, month - 1, 1 + Math.floor(Math.random() * 28)).toISOString(),
        created_at: new Date(year, month - 1, 1 + Math.floor(Math.random() * 28)).toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  return {
    payments: mockPayments.slice((page - 1) * pageSize, page * pageSize),
    total: mockPayments.length,
  };
};

// ==================== DASHBOARD & ANALYTICS ====================

// Get payment metrics
export const getMockPaymentMetrics = async (): Promise<{ data: PaymentMetrics }> => {
  // Mock payment metrics
  return {
    data: {
      total_payments: 1250,
      pending_payments: 150,
      success_payments: 1000,
      failed_payments: 100,
      total_revenue: 250000,
    },
  };
};

// Get user statistics
export const getUserStats = async () => {
  const users = userDataTyped.users;
  const now = new Date();
  const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

  return {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    tenants: users.filter(u => u.role === 'TENANT').length,
    owners: users.filter(u => u.role === 'OWNER').length,
    recentUsers: users
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5),
  };
};

// Get property statistics
export const getPropertyStats = async () => {
  const properties = propertyData.properties;
  const now = new Date();
  const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));

  return {
    total: properties.length,
    available: properties.filter(p => p.status === 'APPROVED').length,
    pending: properties.filter(p => p.status === 'PENDING').length,
    reserved: properties.filter(p => p.status === 'RESERVED').length,
    recentProperties: properties
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5),
  };
};

// Search properties
export const searchProperties = async (query: string): Promise<Property[]> => {
  if (!query.trim()) return [];
  
  const searchLower = query.toLowerCase();
  return propertyData.properties.filter(property => 
    property.title.toLowerCase().includes(searchLower) ||
    property.description.toLowerCase().includes(searchLower) ||
    property.location.toLowerCase().includes(searchLower)
  );
};

// Get properties by status
export const getPropertiesByStatus = async (status: Property['status']): Promise<Property[]> => {
  return propertyData.properties.filter(property => property.status === status);
};

// Get property statistics for dashboard
export const getDashboardStats = async () => {
  const approved = propertyData.properties.filter(p => p.status === 'APPROVED').length;
  const pending = propertyData.properties.filter(p => p.status === 'PENDING').length;
  const reserved = propertyData.properties.filter(p => p.status === 'RESERVED').length;
  const rejected = propertyData.properties.filter(p => p.status === 'REJECTED').length;
  const deleted = propertyData.properties.filter(p => p.status === 'DELETED').length;

  return {
    total: propertyData.properties.length,
    approved,
    pending,
    reserved,
    rejected,
    deleted,
  };
};
