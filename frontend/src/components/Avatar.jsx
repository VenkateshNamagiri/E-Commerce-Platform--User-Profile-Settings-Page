import { useState } from 'react'
import { API_BASE_URL } from '../api'

// "Ravi Kumar" -> "RK", "Ravi" -> "R"
function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

/**
 * Shows the user's photo, or a circle with their initials if they have none.
 *   avatarUrl   - stored relative path, e.g. "/static/uploads/abc.jpg"
 *   previewSrc  - optional local blob: URL, shown instead while the user is
 *                 previewing a photo they haven't uploaded yet
 */
export default function Avatar({ name, avatarUrl, previewSrc, size = 36, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)

  const src = previewSrc || (avatarUrl ? `${API_BASE_URL}${avatarUrl}` : null)
  const style = { width: size, height: size, fontSize: Math.round(size * 0.4) }

  // if the image file is missing/broken, fall back to initials instead of a broken-image icon
  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s profile picture` : 'Profile picture'}
        className={`avatar ${className}`}
        style={style}
        onError={() => setFailedSrc(src)}
      />
    )
  }

  return (
    <div
      className={`avatar avatar-initials ${className}`}
      style={style}
      role="img"
      aria-label={name ? `${name}'s initials` : 'Profile placeholder'}
    >
      {getInitials(name)}
    </div>
  )
}
