#!/usr/bin/env node

/**
 * Simple Pathao Integration Test
 * Tests the Pathao courier service directly
 */

require('dotenv').config({ path: '.env.local' })

const { PathaoCourier } = require('./lib/courier/pathao.ts')

async function testPathaoIntegration() {
  console.log('🧪 Testing Pathao Integration...')
  console.log('=====================================')
  
  try {
    // Initialize Pathao courier service
    const pathaoCourier = new PathaoCourier()
    
    console.log('✅ Pathao courier service initialized')
    
    // Test authentication
    console.log('🔐 Testing authentication...')
    const authResult = await pathaoCourier.authenticate()
    
    if (authResult.success) {
      console.log('✅ Authentication successful')
    } else {
      console.log('❌ Authentication failed:', authResult.error)
      return
    }
    
    // Test fetching cities
    console.log('🏙️ Testing cities API...')
    const citiesResult = await pathaoCourier.getCities()
    
    if (citiesResult.success && citiesResult.data.length > 0) {
      console.log(`✅ Cities API working - found ${citiesResult.data.length} cities`)
      console.log(`   First city: ${citiesResult.data[0].city_name}`)
    } else {
      console.log('❌ Cities API failed:', citiesResult.error)
      return
    }
    
    // Test fetching zones for first city
    console.log('📍 Testing zones API...')
    const firstCity = citiesResult.data[0]
    const zonesResult = await pathaoCourier.getZones(firstCity.city_id)
    
    if (zonesResult.success && zonesResult.data.length > 0) {
      console.log(`✅ Zones API working - found ${zonesResult.data.length} zones`)
      console.log(`   First zone: ${zonesResult.data[0].zone_name}`)
    } else {
      console.log('❌ Zones API failed:', zonesResult.error)
      return
    }
    
    // Test fetching areas for first zone
    console.log('🏘️ Testing areas API...')
    const firstZone = zonesResult.data[0]
    const areasResult = await pathaoCourier.getAreas(firstZone.zone_id)
    
    if (areasResult.success && areasResult.data.length > 0) {
      console.log(`✅ Areas API working - found ${areasResult.data.length} areas`)
      console.log(`   First area: ${areasResult.data[0].area_name}`)
    } else {
      console.log('❌ Areas API failed:', areasResult.error)
      return
    }
    
    // Test cost calculation
    console.log('💰 Testing cost calculation...')
    const firstArea = areasResult.data[0]
    const costResult = await pathaoCourier.calculateDeliveryCost(
      firstCity.city_id,
      firstZone.zone_id,
      firstArea.area_id,
      0.5
    )
    
    if (costResult.success && costResult.data.length > 0) {
      console.log(`✅ Cost calculation working - found ${costResult.data.length} delivery options`)
      console.log(`   First option: ${costResult.data[0].type} - ৳${costResult.data[0].cost}`)
    } else {
      console.log('❌ Cost calculation failed:', costResult.error)
      return
    }
    
    console.log('=====================================')
    console.log('🎉 All Pathao integration tests passed!')
    console.log('✅ Authentication: Working')
    console.log('✅ Cities API: Working')
    console.log('✅ Zones API: Working')
    console.log('✅ Areas API: Working')
    console.log('✅ Cost Calculation: Working')
    console.log('=====================================')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the test
testPathaoIntegration()
