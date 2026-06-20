import { apiClient } from '@/lib/axios'

export type EnquiryStatus = 'New' | 'Contacted' | 'Closed'

/** An enquiry record, mirroring the backend `Enquiry` model. */
export interface Enquiry {
  _id: string
  name: string
  phone: string
  email?: string
  message?: string
  area?: string
  service?: string
  typeOfGold?: string
  callTime?: string
  status: EnquiryStatus
  createdAt: string
  updatedAt: string
}

/** Payload sent by the public consultation form. */
export interface EnquiryInput {
  name: string
  phone: string
  email?: string
  message?: string
  area?: string
  service?: string
  typeOfGold?: string
  callTime?: string
}

export interface EnquiryStats {
  total: number
  today: number
  new: number
  contacted: number
  closed: number
}

/** Public — store a new enquiry from the website. */
export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  const { data } = await apiClient.post<Enquiry>('/enquiries', input)
  return data
}

/** Admin-only — list enquiries, optionally filtered by search text and status. */
export async function fetchEnquiries(params?: {
  search?: string
  status?: EnquiryStatus | ''
}): Promise<Enquiry[]> {
  const { data } = await apiClient.get<Enquiry[]>('/enquiries', { params })
  return data
}

/** Admin-only — dashboard counts. */
export async function fetchEnquiryStats(): Promise<EnquiryStats> {
  const { data } = await apiClient.get<EnquiryStats>('/enquiries/stats')
  return data
}

/** Admin-only — change an enquiry's status. */
export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
): Promise<Enquiry> {
  const { data } = await apiClient.patch<Enquiry>(`/enquiries/${id}`, { status })
  return data
}

/** Admin-only — delete an enquiry. */
export async function deleteEnquiry(id: string): Promise<void> {
  await apiClient.delete(`/enquiries/${id}`)
}
