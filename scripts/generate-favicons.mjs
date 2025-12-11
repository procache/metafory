import sharp from 'sharp'
import { writeFileSync } from 'fs'

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
]

console.log('🎨 Generating favicons from logo_kniha.png...\n')

for (const { size, name } of sizes) {
  await sharp('public/logo_kniha.png')
    .resize(size, size, {
      fit: 'contain',
      background: { r: 248, g: 255, b: 254, alpha: 1 } // #f8fffe background
    })
    .png()
    .toFile(`public/${name}`)

  console.log(`✅ Created ${name} (${size}x${size})`)
}

// Generate favicon.ico (using 32x32 as base)
console.log('\n🔨 Creating favicon.ico...')
const icoBuffer = await sharp('public/logo_kniha.png')
  .resize(32, 32, {
    fit: 'contain',
    background: { r: 248, g: 255, b: 254, alpha: 1 }
  })
  .png()
  .toBuffer()

writeFileSync('public/favicon.ico', icoBuffer)
console.log('✅ Created favicon.ico\n')

console.log('🎉 All favicons generated successfully!')
