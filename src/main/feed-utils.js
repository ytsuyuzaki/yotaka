import path from 'path'

const SUPPORTED_EXTENSION_PATTERN = /\.(m4a|mp3|mov|mp4|m4v)$/i

export function isSupportedMediaFile (filePath) {
  return SUPPORTED_EXTENSION_PATTERN.test(path.extname(filePath))
}

export function buildMediaList (files, baseUrl, statSync) {
  const list = []

  for (const file of files) {
    const extname = path.extname(file)

    if (!isSupportedMediaFile(file)) {
      continue
    }

    const title = path.basename(file, extname)
    const stats = statSync(file)
    const date = stats.atime
    const url = baseUrl + '/media/' + path.basename(file)
    const duration = ''

    list.push({
      file,
      date,
      title,
      url,
      duration
    })
  }

  list.sort((a, b) => b.date - a.date)
  return list
}
