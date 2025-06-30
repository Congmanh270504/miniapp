import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Lấy userId từ URL params
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    // Kiểm tra userId có tồn tại không
    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 })
    }

    // Initialize the Backend SDK
    const client = await clerkClient()

    // Get the user's full Backend User object
    const user = await client.users.getUser(userId)

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
