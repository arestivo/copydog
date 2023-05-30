#!/usr/bin/env node

import { globSync } from 'glob'
import * as ssdeep from 'ssdeep.js'
import * as fs from 'fs-extra'
import yargs from 'yargs'

type comp = {p1: string, p2: string, s: number}

const cache: Map<string, string> = new Map
function hash(file: string) : string {
  if (cache.has(file)) return cache.get(file)!

  const contents = fs.readFileSync(file, 'utf-8')
  const hash = ssdeep.digest(contents)
  cache.set(file, hash)
  return hash
}

function compareFolders(folder1: string, folder2: string, extensions: string[], threshold: number) {
  let count = 0
  let total = 0

  for (const extension of extensions) {
    const files1 = getFiles(folder1, extension)
    const files2 = getFiles(folder2, extension)
  
    total += files1.length

    for (const f1 of files1)
      for (const f2 of files2) {
        const value = compareFiles(f1, f2)
        if (value > threshold) { count++ ; break }
      }
  }

  return count / total
}

function compareFiles(f1: string, f2: string) {
  const hash1 = hash(f1)
  const hash2 = hash(f2)

  return ssdeep.similarity(hash1, hash2)
}

function getFiles (folder: string, extension: string) {
  return globSync(folder + `/**/*.${extension}`, { nodir: true });
}

function status(status: string) {
  process.stdout.write("\r\x1b[K")
  process.stdout.write(status)
}

const args = yargs(process.argv.slice(2)).options({
  f: { type: 'string', alias: 'folders', description: 'list of folders to compare (prefix)', default: '' },
  e: { type: 'string', alias: 'extensions', description: 'list of extensions to consider', default: 'php,css,html,js' },
  t: { type: 'number', alias: 'threshold', description: 'threshold for a file to be considered the same', min: 0, max: 100, default: 50 },
  p: { type: 'number', alias: 'print', description: 'percentage of matched files to be printed', default: 30 },
}).strict().parseSync()

const extensions = args.e.split(',').map(e => e.trim()).filter(f => f !== '')
const folders = args.f.split(',').map(f => f.trim()).filter(f => f !== '')

console.log('Extensions to be considered: ' + extensions.join(', '))
console.log('Folder prefixes to compare: ' + (folders.length === 0 ? 'all folders' : folders.join(', ')))
console.log()
console.log('File threshold: ' + args.t + '%')
console.log('Project threshold: ' + args.p + '%')
console.log()

const folderPattern = folders.length > 1 ? `{${folders.join(',')}}` : folders.join(',')

const comparisons: comp[] = []
const projects = globSync(`./${folderPattern}*/`).sort()

for (const project1 of projects)
  for (const project2 of projects) {
    if (project1 === project2) continue
    const score = compareFolders(project1, project2, extensions, args.t)

    status (`${project1} x ${project2} = ${Math.round(score * 100)}%`)

    if (score * 100 > args.p) comparisons.push({p1: project1, p2: project2, s: score})
  }

comparisons.sort((c1: comp, c2: comp) => c2.s - c1.s)
status('')

console.log('Results:')
for (const comparison of comparisons) 
  console.log(`${comparison.p1} x ${comparison.p2} = ${Math.round(comparison.s * 100)}%`)