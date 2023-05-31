
import * as fs from 'fs-extra' 
import { globSync } from 'glob'

export class Files {
  public readFile (file: string) {
    return fs.readFileSync(file, 'utf-8')
  }  

  public files (folder: string, extension: string) {
    return globSync(folder + `/**/*.${extension}`, { nodir: true });
  }  

  public projects(pattern: string) {
    return globSync(`./${pattern}*/`).sort()
  }
}