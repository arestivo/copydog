import yargs from 'yargs'

export class Command {
  arguments: { f: string, e: string, t: number, p: number }

  constructor() { 
    this.arguments = yargs(process.argv.slice(2)).options({
      f: { type: 'string', alias: 'folders', description: 'list of folders to compare (prefix)', default: '' },
      e: { type: 'string', alias: 'extensions', description: 'list of extensions to consider', default: 'php,css,html,js' },
      t: { type: 'number', alias: 'threshold', description: 'threshold for a file to be considered the same', min: 0, max: 100, default: 50 },
      p: { type: 'number', alias: 'print', description: 'percentage of matched files to be printed', default: 30 },
    }).strict().parseSync()    
  }

  public extensions() {
    return this.arguments.e.split(',').map(e => e.trim()).filter(f => f !== '')
  }

  public folders() {
    return this.arguments.f.split(',').map(f => f.trim()).filter(f => f !== '')
  }

  public folderPattern() {
    return this.folders().length > 1 ? `{${this.folders().join(',')}}` : this.folders().join(',')
  }

  public threshold() {
    return this.arguments.t
  }

  public print() {
    return this.arguments.p
  }
}