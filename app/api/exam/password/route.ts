import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { name, password, exam_id } = await request.json()

    if (!name || !password || !exam_id) {
      return NextResponse.json(
        { error: 'Name, password and exam_id are required' },
        { status: 400 }
      )
    }

    // Create password attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('password_attempts')
      .insert({
        exam_id,
        participant_name: name,
        password_entered: password,
        status: 'pending',
      })
      .select()
      .single()

    if (attemptError) {
      console.error('Error creating password attempt:', attemptError)
      return NextResponse.json(
        { error: 'Failed to submit credentials' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      attemptId: attempt.id 
    })
  } catch (error) {
    console.error('Error in password submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const attemptId = searchParams.get('attemptId')

    if (!attemptId) {
      return NextResponse.json(
        { error: 'attemptId is required' },
        { status: 400 }
      )
    }

    const { data: attempt, error } = await supabase
      .from('password_attempts')
      .select('*')
      .eq('id', attemptId)
      .single()

    if (error) {
      console.error('Error fetching attempt:', error)
      return NextResponse.json(
        { error: 'Failed to check status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      status: attempt.status,
      participantName: attempt.participant_name
    })
  } catch (error) {
    console.error('Error in password check:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
