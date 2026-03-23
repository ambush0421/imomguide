import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Resvg } from '@resvg/resvg-js'
import pngToIco from 'png-to-ico'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.join(__dirname, '..')
const publicDir = path.join(workspaceRoot, 'public')
const brandDir = path.join(publicDir, 'brand')
const electronAssetsDir = path.join(workspaceRoot, 'electron', 'assets')

const sourceSvgPath = path.join(brandDir, 'magok-codefinder-symbol.svg')
const rootSvgPath = path.join(publicDir, 'favicon.svg')

const pngTargets = [
  {
    size: 16,
    outputs: [
      path.join(publicDir, 'favicon-16x16.png'),
      path.join(brandDir, 'favicon-16.png'),
    ],
  },
  {
    size: 32,
    outputs: [
      path.join(publicDir, 'favicon-32x32.png'),
      path.join(brandDir, 'favicon-32.png'),
    ],
  },
  {
    size: 48,
    outputs: [path.join(brandDir, 'favicon-48.png')],
  },
  {
    size: 180,
    outputs: [
      path.join(publicDir, 'apple-touch-icon.png'),
      path.join(brandDir, 'apple-touch-icon.png'),
    ],
  },
  {
    size: 256,
    outputs: [
      path.join(electronAssetsDir, 'app-icon.png'),
      path.join(electronAssetsDir, 'app-icon@256.png'),
    ],
  },
  {
    size: 512,
    outputs: [path.join(electronAssetsDir, 'app-icon@512.png')],
  },
]

const icoOutputPaths = [
  path.join(publicDir, 'favicon.ico'),
  path.join(brandDir, 'favicon.ico'),
  path.join(electronAssetsDir, 'app-icon.ico'),
]

const icoSizes = [16, 32, 48, 64, 128, 256]

async function writeFileEnsuringDirectory(targetPath, contents) {
  await fs.mkdir(path.dirname(targetPath), {
    recursive: true,
  })
  await fs.writeFile(targetPath, contents)
}

function renderPng(svgSource, size) {
  const resvg = new Resvg(svgSource, {
    fitTo: {
      mode: 'width',
      value: size,
    },
  })

  return Buffer.from(resvg.render().asPng())
}

async function main() {
  const sourceSvg = await fs.readFile(sourceSvgPath, 'utf8')
  const renderedPngs = new Map()

  await writeFileEnsuringDirectory(rootSvgPath, sourceSvg)

  for (const target of pngTargets) {
    const pngBuffer = renderPng(sourceSvg, target.size)
    renderedPngs.set(target.size, pngBuffer)

    await Promise.all(
      target.outputs.map((outputPath) =>
        writeFileEnsuringDirectory(outputPath, pngBuffer),
      ),
    )
  }

  // Windows app icons benefit from larger ICO frames than browsers need.
  const icoBuffers = icoSizes.map((size) => {
    const existingBuffer = renderedPngs.get(size)

    if (existingBuffer) {
      return existingBuffer
    }

    const pngBuffer = renderPng(sourceSvg, size)
    renderedPngs.set(size, pngBuffer)
    return pngBuffer
  })

  const icoBuffer = await pngToIco(icoBuffers)

  await Promise.all(
    icoOutputPaths.map((outputPath) =>
      writeFileEnsuringDirectory(outputPath, icoBuffer),
    ),
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
