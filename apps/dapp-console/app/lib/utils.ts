import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateString(date: Date) {
  return date.toLocaleString('default', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}
