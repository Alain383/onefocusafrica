const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')

const db = new Database('./prisma/prisma/dev.db')

const email = 'admin@onefocus.africa'
const password = 'admin123'
const hashedPassword = bcrypt.hashSync(password, 12)

db.exec(`
  INSERT OR REPLACE INTO AdminUser (
    id,
    email,
    hashedPassword,
    name,
    role,
    isActive,
    createdAt,
    lastLoginAt
  ) VALUES (
    COALESCE((SELECT id FROM AdminUser WHERE email = '${email}'), lower(hex(randomblob(16)))),
    '${email}',
    '${hashedPassword}',
    'Admin User',
    'ADMIN',
    1,
    datetime('now'),
    NULL
  )
`)

const user = db.prepare('SELECT * FROM AdminUser WHERE email = ?').get(email)
console.log('✓ Admin user created!')
console.log('Login with:', email, '/', password)

db.close()
