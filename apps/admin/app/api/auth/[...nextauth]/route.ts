import nextAuthResult from '@/lib/auth'

// Extract and export only the HTTP method handlers
const { handlers } = nextAuthResult
export const { GET, POST } = handlers