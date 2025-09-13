"use client"

import Image from 'next/image'
import Link from 'next/link'

interface BannerProps {
  id: string
  title: string
  description?: string
  image: string
  link?: string
  position: string
  priority: number
  isActive: boolean
  startsAt?: string
  expiresAt?: string
  className?: string
}

export default function Banner({
  title,
  description,
  image,
  link,
  className = ""
}: BannerProps) {
  const bannerContent = (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={image}
        alt={title}
        width={1200}
        height={400}
        className="w-full h-auto object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h2 className="text-2xl md:text-4xl font-bold mb-2">{title}</h2>
          {description && (
            <p className="text-lg md:text-xl opacity-90">{description}</p>
          )}
        </div>
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} className="block hover:opacity-90 transition-opacity">
        {bannerContent}
      </Link>
    )
  }

  return bannerContent
}
