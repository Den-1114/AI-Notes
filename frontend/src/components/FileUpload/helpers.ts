export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const validateFile = (
  file: File,
  maxSize: number,
  allowedTypes: string[]
): string | null => {
  if (file.size > maxSize) {
    return `${file.name}: File must be under ${maxSize / (1024 * 1024)} MB`
  }
  if (!allowedTypes.includes(file.type)) {
    return `${file.name}: Invalid file type`
  }
  return null
}
