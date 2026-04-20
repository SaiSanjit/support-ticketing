import type { CSSProperties } from 'react'

interface AvatarProps {
  name: string
  size?: number
  style?: CSSProperties
}

const PALETTE = [
  { bg: 'linear-gradient(135deg, #7ca7f6, #4f7fd4)', text: '#101113' },
  { bg: 'linear-gradient(135deg, #8dc9c1, #4b8f8f)', text: '#101113' },
  { bg: 'linear-gradient(135deg, #f6c177, #d48f4a)', text: '#101113' },
  { bg: 'linear-gradient(135deg, #f09fa5, #cb6e76)', text: '#101113' },
  { bg: 'linear-gradient(135deg, #b3a5ff, #7b6cd9)', text: '#101113' },
  { bg: 'linear-gradient(135deg, #9be7a7, #63b56e)', text: '#101113' },
]

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function getColorIndex(name: string) {
  let hash = 0

  for (let index = 0; index < name.length; index += 1) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash)
  }

  return Math.abs(hash) % PALETTE.length
}

export default function Avatar({ name, size = 36, style }: AvatarProps) {
  const { bg, text } = PALETTE[getColorIndex(name)]
  const fontSize = Math.round(size * 0.34)

  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        color: text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--avatar-shadow)',
        fontFamily: 'var(--font-body)',
        fontWeight: 800,
        fontSize,
        letterSpacing: '0.02em',
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
    >
      {getInitials(name)}
    </div>
  )
}
