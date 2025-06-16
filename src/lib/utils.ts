import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString)

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }

  // Format: Jun 14, 2025, 3:57 PM
  const formatted = date.toLocaleString('en-US', options)

  // Ganti koma dengan " · "
  return formatted.replace(',', ' ·')
}

export function getInitialAvatar(username: string): string {
  return username?.trim().charAt(0).toUpperCase() || 'A'
}
