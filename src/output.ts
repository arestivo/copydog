import { comparison } from "./matcher"

export class Output {
  constructor() { }

  public header(extensions: string[], folders: string[], threshold: number, print: number) {
    console.log('Extensions to be considered: ' + extensions.join(', '))
    console.log('Folder prefixes to compare: ' + (folders.length === 0 ? 'all folders' : folders.join(', ')))
    console.log()
    console.log('File threshold: ' + threshold + '%')
    console.log('Project threshold: ' + print + '%')
    console.log()
  }

  public status(status: string) {
    process.stdout.write("\r\x1b[K")
    process.stdout.write(status)
  }  

  public results(comparisons: comparison[]) {
    this.status('')
    console.log('Results:\n')
    for (const comparison of comparisons) 
      console.log(`${comparison.p1} x ${comparison.p2} = ${Math.round(comparison.s * 100)}%`)
  }
}