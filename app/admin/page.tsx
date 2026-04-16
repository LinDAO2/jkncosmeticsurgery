import { createClient } from '@supabase/supabase-js'
import AdminDashboard from './AdminDashboard'

export const revalidate = 0

async function getInquiries() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AdminPage() {
  const inquiries = await getInquiries()
  return <AdminDashboard inquiries={inquiries} />
}
