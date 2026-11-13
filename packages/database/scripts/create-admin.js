#!/usr/bin/env node
/**
 * Secure Admin User Creation Script
 * 
 * Usage:
 *   export ADMIN_NAME="Your Name"
 *   export ADMIN_EMAIL="admin@example.com"
 *   export ADMIN_PASSWORD="secure-password"
 *   export DATABASE_URL="postgresql://..."
 *   node packages/database/scripts/create-admin.js
 * 
 * NEVER commit credentials or expose this endpoint via HTTP.
 * Run locally only with environment variables.
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Validate required environment variables
    const name = process.env.ADMIN_NAME
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!name || !email || !password) {
      console.error('❌ Missing required environment variables:')
      console.error('   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD')
      console.error('')
      console.error('Usage:')
      console.error('  export ADMIN_NAME="Your Name"')
      console.error('  export ADMIN_EMAIL="admin@example.com"')
      console.error('  export ADMIN_PASSWORD="secure-password"')
      console.error('  node packages/database/scripts/create-admin.js')
      process.exit(1)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error(`❌ Invalid email format: ${email}`)
      process.exit(1)
    }

    // Validate password strength
    if (password.length < 8) {
      console.error('❌ Password must be at least 8 characters long')
      process.exit(1)
    }

    console.log('🔐 Creating admin user...')
    console.log(`   Name: ${name}`)
    console.log(`   Email: ${email}`)
    console.log(`   Role: ADMIN`)
    console.log('')

    // Hash password with bcrypt (12 rounds)
    console.log('🔒 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create or update admin user
    console.log('💾 Saving to database...')
    const user = await prisma.adminUser.upsert({
      where: { email },
      update: {
        name,
        hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
      create: {
        email,
        name,
        hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    })

    console.log('')
    console.log('✅ Admin user created successfully!')
    console.log('')
    console.log('📋 User Details:')
    console.log(`   ID: ${user.id}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Created: ${user.createdAt.toISOString()}`)
    console.log('')
    console.log('🔑 Login Credentials:')
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: [hidden for security]`)
    console.log('')
    console.log('⚠️  Store credentials securely and clear terminal history.')
    console.log('')

    process.exit(0)
  } catch (error) {
    console.error('')
    console.error('❌ Error creating admin user:')
    console.error(error.message)
    console.error('')
    
    if (error.code === 'P2002') {
      console.error('💡 User with this email already exists.')
      console.error('   The password has been updated.')
    } else if (error.code === 'P1001') {
      console.error('💡 Cannot connect to database.')
      console.error('   Check your DATABASE_URL environment variable.')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Check if running directly (not imported)
if (require.main === module) {
  createAdmin()
}

module.exports = { createAdmin }
