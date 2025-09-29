import { execSync } from 'node:child_process'

const critical = new Set([
  'src/components/SermonAnalyzer.tsx',
  'src/pages/SermonAnalyzerPage.tsx',
])

try {
  const out = execSync('git diff --cached --name-status', { encoding: 'utf-8' })
  const lines = out.split('\n').filter(Boolean)

  const deleted = lines
    .map((l) => l.trim().split(/\s+/))
    .filter(([status, path]) => status === 'D' && critical.has(path))
    .map(([, path]) => path)

  if (deleted.length > 0) {
    console.error('\n[PROTECT] Commit blocked: deleting critical file(s) is not allowed:\n- ' + deleted.join('\n- ') + '\n')
    process.exit(1)
  }
} catch (e) {
  // если git недоступен, не блокируем, но выводим предупреждение
  console.warn('[PROTECT] Warning: failed to run deletion check:', e?.message)
}


