import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

async function importAllSpecs(dir: string) {
  const files = await readdir(dir)
  for (const file of files) {
    const fullPath = join(dir, file)
    const s = await stat(fullPath)
    if (s.isDirectory()) {
      importAllSpecs(fullPath)
    } else if (extname(file) === '.ts' && file.endsWith('.spec.ts')) {
      await import(fullPath)
    }
  }
}

importAllSpecs(join(__dirname, 'src'))
