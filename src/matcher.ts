import { HashCache } from './cache'
import { Command } from './command'
import { Files } from './files'
import { Output } from './output'

export type comparison = {p1: string, p2: string, s: number}

export class Matcher {
  cache: HashCache
  filesystem: Files

  constructor(private command: Command, private output: Output) { 
    this.cache = new HashCache 
    this.filesystem = new Files
  }
  
  private process(file: string) {
    if (!this.cache.has(file)) {
      const contents = this.filesystem.readFile(file, this.command.whitespace())
      this.cache.add(file, contents)
    }
  }

  private compareFiles(f1: string, f2: string) {
    this.process(f1)
    this.process(f2)
  
    return this.cache.similarity(f1, f2)
  }

  private compareFolders(folder1: string, folder2: string, extensions: string[], threshold: number) {
    let count = 0
    let total = 0
  
    for (const extension of extensions) {
      const files1 = this.filesystem.files(folder1, extension)
      const files2 = this.filesystem.files(folder2, extension)
    
      total += files1.length
  
      for (const f1 of files1)
        for (const f2 of files2) {
          const value = this.compareFiles(f1, f2)
          if (value > threshold) { count++ ; break }
        }
    }
  
    return count / total
  } 

  public compareProjects() {
    const comparisons: comparison[] = []
    const projects = this.filesystem.projects(this.command.folderPattern())


    for (const project1 of projects)
      for (const project2 of projects) {
        if (project1 === project2) continue
        const score = this.compareFolders(project1, project2, this.command.extensions(), this.command.threshold())

        this.output.status(`${project1} x ${project2} = ${Math.round(score * 100)}%`)

        if (score * 100 > this.command.print()) 
          comparisons.push({p1: project1, p2: project2, s: score})
      }

    comparisons.sort((c1: comparison, c2: comparison) => c2.s - c1.s)
    return comparisons
  }
}