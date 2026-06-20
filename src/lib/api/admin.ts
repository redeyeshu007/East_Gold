import { apiClient } from '@/lib/axios'

/** The authenticated admin's profile. */
export interface AdminProfile {
  _id: string
  username: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface AdminProfileUpdate {
  name?: string
  email?: string
  /** When non-empty, changes the password. */
  password?: string
}

/** Admin-only — current profile. */
export async function fetchAdminProfile(): Promise<AdminProfile> {
  const { data } = await apiClient.get<AdminProfile>('/admin/me')
  return data
}

/** Admin-only — update profile and/or password. */
export async function updateAdminProfile(update: AdminProfileUpdate): Promise<AdminProfile> {
  const { data } = await apiClient.patch<AdminProfile>('/admin/me', update)
  return data
}
