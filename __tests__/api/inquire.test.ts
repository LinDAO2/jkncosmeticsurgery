import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase
const mockInsert = vi.fn()
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({ insert: mockInsert }),
  },
}))

// Mock Resend
const mockSend = vi.fn()
vi.mock('@/lib/resend', () => ({
  resend: { emails: { send: mockSend } },
  RESEND_TO_EMAIL: 'doctor@jkncosmeticsurgery.com',
}))

// Import after mocks
const { POST } = await import('@/app/api/inquire/route')

function makeRequest(body: object) {
  return new Request('http://localhost/api/inquire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockInsert.mockResolvedValue({ error: null })
  mockSend.mockResolvedValue({ id: 'email-id' })
})

describe('POST /api/inquire', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeRequest({ first_name: 'John' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it('inserts inquiry into Supabase and sends email on valid payload', async () => {
    const payload = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone: '555-1234',
      procedure_interest: 'Rhinoplasty',
      message: 'Hello',
    }
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(200)
    expect(mockInsert).toHaveBeenCalledWith([payload])
    expect(mockSend).toHaveBeenCalledOnce()
  })

  it('returns 500 when Supabase insert fails', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'DB error' } })
    const res = await POST(makeRequest({
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
    }))
    expect(res.status).toBe(500)
  })
})
