#!/usr/bin/env node

/**
 * Direct Pathao API Test
 * Tests the Pathao API directly without the courier service
 */

require('dotenv').config({ path: '.env.local' })

async function testPathaoDirect() {
  console.log('🧪 Testing Pathao API Directly...')
  console.log('=====================================')
  
  try {
    // Test authentication
    console.log('🔐 Testing authentication...')
    
    const authResponse = await fetch('https://api-hermes.pathao.com/api/v1/issue-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.PATHAO_CLIENT_ID,
        client_secret: process.env.PATHAO_CLIENT_SECRET,
        username: process.env.PATHAO_USERNAME,
        password: process.env.PATHAO_PASSWORD,
        grant_type: 'password'
      })
    })

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.log('❌ Authentication failed:', errorText)
      return
    }

    const authText = await authResponse.text()
    console.log('Auth response text:', authText)
    
    let authData
    try {
      authData = JSON.parse(authText)
    } catch (parseError) {
      console.log('❌ Failed to parse auth response as JSON:', parseError.message)
      console.log('Raw response:', authText)
      return
    }
    console.log('✅ Authentication successful')
    console.log(`   Token type: ${authData.token_type}`)
    console.log(`   Expires in: ${authData.expires_in} seconds`)
    
    const accessToken = authData.access_token
    
    // Test cities API
    console.log('🏙️ Testing cities API...')
    
    const citiesResponse = await fetch('https://api-hermes.pathao.com/api/v1/cities', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!citiesResponse.ok) {
      const errorData = await citiesResponse.json()
      console.log('❌ Cities API failed:', errorData)
      return
    }

    const citiesData = await citiesResponse.json()
    console.log(`✅ Cities API working - found ${citiesData.data.length} cities`)
    console.log(`   First city: ${citiesData.data[0].city_name} (ID: ${citiesData.data[0].city_id})`)
    
    // Test zones API with first city
    console.log('📍 Testing zones API...')
    
    const firstCity = citiesData.data[0]
    const zonesResponse = await fetch(`https://api-hermes.pathao.com/api/v1/zones?city_id=${firstCity.city_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!zonesResponse.ok) {
      const errorData = await zonesResponse.json()
      console.log('❌ Zones API failed:', errorData)
      return
    }

    const zonesData = await zonesResponse.json()
    console.log(`✅ Zones API working - found ${zonesData.data.length} zones`)
    console.log(`   First zone: ${zonesData.data[0].zone_name} (ID: ${zonesData.data[0].zone_id})`)
    
    // Test areas API with first zone
    console.log('🏘️ Testing areas API...')
    
    const firstZone = zonesData.data[0]
    const areasResponse = await fetch(`https://api-hermes.pathao.com/api/v1/areas?zone_id=${firstZone.zone_id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!areasResponse.ok) {
      const errorData = await areasResponse.json()
      console.log('❌ Areas API failed:', errorData)
      return
    }

    const areasData = await areasResponse.json()
    console.log(`✅ Areas API working - found ${areasData.data.length} areas`)
    console.log(`   First area: ${areasData.data[0].area_name} (ID: ${areasData.data[0].area_id})`)
    
    // Test cost calculation
    console.log('💰 Testing cost calculation...')
    
    const firstArea = areasData.data[0]
    const costResponse = await fetch('https://api-hermes.pathao.com/api/v1/merchant/price-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        city_id: firstCity.city_id,
        zone_id: firstZone.zone_id,
        area_id: firstArea.area_id,
        weight: 0.5
      })
    })

    if (!costResponse.ok) {
      const errorData = await costResponse.json()
      console.log('❌ Cost calculation failed:', errorData)
      return
    }

    const costData = await costResponse.json()
    console.log(`✅ Cost calculation working - found ${costData.data.length} delivery options`)
    if (costData.data.length > 0) {
      console.log(`   First option: ${costData.data[0].delivery_type_name} - ৳${costData.data[0].cost}`)
    }
    
    console.log('=====================================')
    console.log('🎉 All Pathao API tests passed!')
    console.log('✅ Authentication: Working')
    console.log('✅ Cities API: Working')
    console.log('✅ Zones API: Working')
    console.log('✅ Areas API: Working')
    console.log('✅ Cost Calculation: Working')
    console.log('=====================================')
    console.log('')
    console.log('📋 Summary:')
    console.log(`   - ${citiesData.data.length} cities available`)
    console.log(`   - ${zonesData.data.length} zones in ${firstCity.city_name}`)
    console.log(`   - ${areasData.data.length} areas in ${firstZone.zone_name}`)
    console.log(`   - ${costData.data.length} delivery options available`)
    console.log('')
    console.log('🚀 Pathao integration is ready to use!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the test
testPathaoDirect()
