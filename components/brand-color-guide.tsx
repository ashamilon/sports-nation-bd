'use client'

import { useState } from 'react'
import Image from 'next/image'

const brandColors = [
  { name: 'Brand Light', hex: '#FEFEFE', class: 'bg-brand-light', textClass: 'text-brand-dark' },
  { name: 'Brand Light Gray', hex: '#E7E9F0', class: 'bg-brand-light-gray', textClass: 'text-brand-dark' },
  { name: 'Brand Dark', hex: '#051747', class: 'bg-brand-dark', textClass: 'text-brand-light' },
  { name: 'Brand Medium', hex: '#535F80', class: 'bg-brand-medium', textClass: 'text-brand-light' },
  { name: 'Brand Accent', hex: '#081F62', class: 'bg-brand-accent', textClass: 'text-brand-light' },
]

const accentColors = [
  { name: 'Success (Green)', hex: '#16a34a', class: 'bg-success', textClass: 'text-success-foreground' },
  { name: 'Destructive (Red)', hex: '#dc2626', class: 'bg-destructive', textClass: 'text-destructive-foreground' },
]

export default function BrandColorGuide() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 relative">
            <Image
              src="/logo.png"
              alt="Sports Nation BD Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-2">Brand Color Guide</h1>
            <p className="text-brand-medium">Your Sports Nation BD brand colors and usage guidelines</p>
          </div>
        </div>
      </div>

      {/* Brand Logo Showcase */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-brand-dark mb-6">Brand Logo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-light border border-brand-light-gray rounded-lg p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image
                src="/logo.png"
                alt="Sports Nation BD Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-medium text-brand-dark mb-2">Light Background</h3>
            <p className="text-sm text-brand-medium">Perfect for light backgrounds and headers</p>
          </div>
          
          <div className="bg-brand-dark rounded-lg p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image
                src="/logo.png"
                alt="Sports Nation BD Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-medium text-brand-light mb-2">Dark Background</h3>
            <p className="text-sm text-brand-light-gray">Great for dark themes and footers</p>
          </div>
          
          <div className="bg-brand-light-gray rounded-lg p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <Image
                src="/logo.png"
                alt="Sports Nation BD Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-medium text-brand-dark mb-2">Gray Background</h3>
            <p className="text-sm text-brand-medium">Ideal for cards and secondary areas</p>
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-brand-dark mb-6">Primary Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandColors.map((color) => (
            <div key={color.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`h-24 ${color.class} flex items-center justify-center`}>
                <span className={`text-lg font-semibold ${color.textClass}`}>
                  {color.name}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-brand-dark mb-2">{color.name}</h3>
                <div className="flex items-center justify-between">
                  <code className="text-sm text-brand-medium bg-brand-light-gray px-2 py-1 rounded">
                    {color.hex}
                  </code>
                  <button
                    onClick={() => copyToClipboard(color.hex)}
                    className="text-xs text-brand-accent hover:text-brand-dark transition-colors"
                  >
                    {copiedColor === color.hex ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="mt-2 text-xs text-brand-medium">
                  Classes: <code>{color.class}</code>, <code>{color.textClass}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accent Colors */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-brand-dark mb-6">Accent Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accentColors.map((color) => (
            <div key={color.name} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`h-24 ${color.class} flex items-center justify-center`}>
                <span className={`text-lg font-semibold ${color.textClass}`}>
                  {color.name}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-brand-dark mb-2">{color.name}</h3>
                <div className="flex items-center justify-between">
                  <code className="text-sm text-brand-medium bg-brand-light-gray px-2 py-1 rounded">
                    {color.hex}
                  </code>
                  <button
                    onClick={() => copyToClipboard(color.hex)}
                    className="text-xs text-brand-accent hover:text-brand-dark transition-colors"
                  >
                    {copiedColor === color.hex ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="mt-2 text-xs text-brand-medium">
                  Classes: <code>{color.class}</code>, <code>{color.textClass}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-brand-dark mb-6">Usage Examples</h2>
        <div className="space-y-6">
          {/* Buttons */}
          <div>
            <h3 className="text-lg font-medium text-brand-dark mb-3">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-brand-dark text-brand-light rounded-lg hover:bg-brand-accent transition-colors">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-brand-light-gray text-brand-dark rounded-lg hover:bg-brand-medium transition-colors">
                Secondary Button
              </button>
              <button className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-opacity">
                Success Button
              </button>
              <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity">
                Destructive Button
              </button>
            </div>
          </div>

          {/* Cards */}
          <div>
            <h3 className="text-lg font-medium text-brand-dark mb-3">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-brand-light border border-brand-light-gray rounded-lg p-4">
                <h4 className="font-medium text-brand-dark mb-2">Light Card</h4>
                <p className="text-brand-medium text-sm">Perfect for content areas and backgrounds.</p>
              </div>
              <div className="bg-brand-dark text-brand-light rounded-lg p-4">
                <h4 className="font-medium mb-2">Dark Card</h4>
                <p className="text-brand-light-gray text-sm">Great for highlights and important content.</p>
              </div>
            </div>
          </div>

          {/* Text Examples */}
          <div>
            <h3 className="text-lg font-medium text-brand-dark mb-3">Text Colors</h3>
            <div className="space-y-2">
              <p className="text-brand-dark text-lg font-semibold">Primary Text (Brand Dark)</p>
              <p className="text-brand-medium">Secondary Text (Brand Medium)</p>
              <p className="text-brand-light-gray">Muted Text (Brand Light Gray)</p>
              <p className="text-success">Success Text (Green)</p>
              <p className="text-destructive">Error Text (Red)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind Classes Reference */}
      <div>
        <h2 className="text-2xl font-semibold text-brand-dark mb-6">Tailwind Classes Reference</h2>
        <div className="bg-brand-light-gray rounded-lg p-6">
          <h3 className="font-medium text-brand-dark mb-4">Background Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <code className="block mb-2">bg-brand-light</code>
              <code className="block mb-2">bg-brand-light-gray</code>
              <code className="block mb-2">bg-brand-dark</code>
            </div>
            <div>
              <code className="block mb-2">bg-brand-medium</code>
              <code className="block mb-2">bg-brand-accent</code>
              <code className="block mb-2">bg-success</code>
            </div>
          </div>
          
          <h3 className="font-medium text-brand-dark mb-4 mt-6">Text Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <code className="block mb-2">text-brand-light</code>
              <code className="block mb-2">text-brand-light-gray</code>
              <code className="block mb-2">text-brand-dark</code>
            </div>
            <div>
              <code className="block mb-2">text-brand-medium</code>
              <code className="block mb-2">text-brand-accent</code>
              <code className="block mb-2">text-destructive</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
