import * as golang from './golang'
import * as typescript from './typescript'

export function getLanguage(lang: string) {
  switch (lang) {
    case 'go':
      return golang
    case 'typescript':
      return typescript
    default:
      throw new Error(`Unsupported language: ${lang}`)
  }
}
