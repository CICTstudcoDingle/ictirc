import { NextRequest, NextResponse } from 'next/server'
import { setupIndices, clearAllIndices, getIndexStats, syncAllData } from '@ictirc/search'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    switch (action) {
      case 'setup':
        await setupIndices()
        return NextResponse.json({ 
          success: true, 
          message: 'Algolia indices setup successfully' 
        })

      case 'sync':
        await syncAllData()
        return NextResponse.json({ 
          success: true, 
          message: 'Data synchronized to Algolia successfully' 
        })

      case 'clear':
        await clearAllIndices() 
        return NextResponse.json({ 
          success: true, 
          message: 'All indices cleared successfully' 
        })

      case 'stats':
        const stats = await getIndexStats()
        return NextResponse.json({ 
          success: true, 
          data: stats 
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Search management error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'An error occurred'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = await getIndexStats()
    return NextResponse.json({ 
      success: true, 
      data: stats 
    })
  } catch (error) {
    console.error('Search stats error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get search statistics'
      },
      { status: 500 }
    )
  }
}