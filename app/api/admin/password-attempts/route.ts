import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Get all pending password attempts
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: attempts, error } = await supabase
      .from('password_attempts')
      .select('*, exams(title)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching password attempts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch attempts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ attempts })
  } catch (error) {
    console.error('Error in password attempts fetch:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Approve or decline a password attempt
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { attemptId, status, reviewedBy } = await request.json()

    if (!attemptId || !status || !['approved', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('password_attempts')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy || 'admin',
      })
      .eq('id', attemptId)
      .select()
      .single()

    if (error) {
      console.error('Error updating password attempt:', error)
      return NextResponse.json(
        { error: 'Failed to update attempt' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, attempt: data })
  } catch (error) {
    console.error('Error in password attempt update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
