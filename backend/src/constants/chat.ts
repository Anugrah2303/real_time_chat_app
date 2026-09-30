import path from 'path'

export const MAX_MESSAGE_LENGTH = 2000
export const MAX_FILE_SIZE = 2 * 1024 * 1024
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export const ALLOWED_FILE_TYPES: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
  'text/plain': '.txt'
}

export const FILE_URL_REGEX = /^\/uploads\/[\w-]+\.[a-z0-9]+$/i
