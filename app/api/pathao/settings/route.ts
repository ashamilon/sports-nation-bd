import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { environment, clientId, clientSecret, username, password } = await request.json()

    // Validate required fields
    if (!environment || !clientId || !clientSecret || !username || !password) {
      return NextResponse.json({ 
        error: 'All fields are required' 
      }, { status: 400 })
    }

    // Read current .env.local file
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = ''
    
    try {
      envContent = await fs.readFile(envPath, 'utf-8')
    } catch (error) {
      // File doesn't exist, create new content
      envContent = ''
    }

    // Update or add Pathao environment variables
    const envLines = envContent.split('\n')
    const updatedLines = []
    const pathaoVars = [
      'PATHAO_ENVIRONMENT',
      'PATHAO_CLIENT_ID',
      'PATHAO_CLIENT_SECRET', 
      'PATHAO_USERNAME',
      'PATHAO_PASSWORD',
      'PATHAO_BASE_URL',
      'PATHAO_SANDBOX_CLIENT_ID',
      'PATHAO_SANDBOX_CLIENT_SECRET',
      'PATHAO_SANDBOX_USERNAME',
      'PATHAO_SANDBOX_PASSWORD',
      'PATHAO_SANDBOX_BASE_URL'
    ]

    // Keep non-Pathao variables
    for (const line of envLines) {
      const trimmedLine = line.trim()
      if (trimmedLine && !pathaoVars.some(varName => trimmedLine.startsWith(varName))) {
        updatedLines.push(line)
      }
    }

    // Add new Pathao configuration
    if (environment === 'production') {
      updatedLines.push(`PATHAO_ENVIRONMENT=production`)
      updatedLines.push(`PATHAO_CLIENT_ID=${clientId}`)
      updatedLines.push(`PATHAO_CLIENT_SECRET=${clientSecret}`)
      updatedLines.push(`PATHAO_USERNAME=${username}`)
      updatedLines.push(`PATHAO_PASSWORD=${password}`)
      updatedLines.push(`PATHAO_BASE_URL=https://api-hermes.pathao.com`)
    } else {
      updatedLines.push(`PATHAO_ENVIRONMENT=sandbox`)
      updatedLines.push(`PATHAO_SANDBOX_CLIENT_ID=${clientId}`)
      updatedLines.push(`PATHAO_SANDBOX_CLIENT_SECRET=${clientSecret}`)
      updatedLines.push(`PATHAO_SANDBOX_USERNAME=${username}`)
      updatedLines.push(`PATHAO_SANDBOX_PASSWORD=${password}`)
      updatedLines.push(`PATHAO_SANDBOX_BASE_URL=https://courier-api-sandbox.pathao.com`)
    }

    // Write updated content back to file
    await fs.writeFile(envPath, updatedLines.join('\n'))

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully',
      environment 
    })
  } catch (error) {
    console.error('Save settings error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to save settings' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return current settings (without sensitive data)
    const environment = process.env.PATHAO_ENVIRONMENT || 'sandbox'
    
    const settings = {
      environment,
      clientId: environment === 'production' 
        ? process.env.PATHAO_CLIENT_ID 
        : process.env.PATHAO_SANDBOX_CLIENT_ID,
      username: environment === 'production' 
        ? process.env.PATHAO_USERNAME 
        : process.env.PATHAO_SANDBOX_USERNAME,
      baseUrl: environment === 'production' 
        ? process.env.PATHAO_BASE_URL 
        : process.env.PATHAO_SANDBOX_BASE_URL
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to get settings' 
    }, { status: 500 })
  }
}
