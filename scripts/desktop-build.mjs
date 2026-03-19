import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'

const workspaceRoot = process.cwd()
const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const electronBuilderExecutable =
  process.platform === 'win32'
    ? path.join(workspaceRoot, 'node_modules', '.bin', 'electron-builder.cmd')
    : path.join(workspaceRoot, 'node_modules', '.bin', 'electron-builder')

async function ensureDirectory(targetPath) {
  await fs.mkdir(targetPath, {
    recursive: true,
  })
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function getDirectoryEntries(targetPath) {
  try {
    return await fs.readdir(targetPath, {
      withFileTypes: true,
    })
  } catch {
    return []
  }
}

async function seedNsisCache(cacheRoot) {
  const stableNsisDir = path.join(
    cacheRoot,
    'shared',
    'nsis',
    'nsis-3.0.4.1-nsis-3.0.4.1',
  )

  if (await pathExists(path.join(stableNsisDir, 'elevate.exe'))) {
    return
  }

  const cacheRoots = [cacheRoot]
  const topLevelEntries = await getDirectoryEntries(cacheRoot)

  for (const entry of topLevelEntries) {
    if (entry.isDirectory()) {
      cacheRoots.push(path.join(cacheRoot, entry.name))
    }
  }

  for (const baseDir of cacheRoots) {
    const nsisDir = path.join(baseDir, 'nsis')

    if (!(await pathExists(nsisDir))) {
      continue
    }

    const nsisEntries = await getDirectoryEntries(nsisDir)

    for (const entry of nsisEntries) {
      if (!entry.isDirectory() || entry.name.startsWith('nsis-')) {
        continue
      }

      const sourceDir = path.join(nsisDir, entry.name)

      if (!(await pathExists(path.join(sourceDir, 'elevate.exe')))) {
        continue
      }

      await ensureDirectory(path.dirname(stableNsisDir))
      await fs.cp(sourceDir, stableNsisDir, {
        recursive: true,
        force: true,
      })
      return
    }
  }
}

function runCommand(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: workspaceRoot,
      env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} exited with code ${code ?? 'unknown'}`))
    })
  })
}

async function main() {
  const cacheRoot = path.join(workspaceRoot, '.electron-builder-cache')
  const runCache = path.join(cacheRoot, 'shared')

  await ensureDirectory(runCache)
  await seedNsisCache(cacheRoot)
  await runCommand(npmExecutable, ['run', 'build'])
  await runCommand(
    electronBuilderExecutable,
    ['--win', 'portable'],
    {
      ...process.env,
      ELECTRON_BUILDER_CACHE: runCache,
    },
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
