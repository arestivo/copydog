import * as ssdeep from 'ssdeep.js'

export class HashCache {
  cache: Map<string, string>

  constructor() {
    this.cache = new Map
  }

  public add(key: string, contents: string) {
    const hash = ssdeep.digest(contents)
    this.cache.set(key, hash)
  } 

  public get(key: string) {
    return this.cache.get(key)
  }

  public has(key: string) {
    return this.cache.has(key)
  }

  public similarity(key1: string, key2: string) {
    return ssdeep.similarity(this.cache.get(key1), this.cache.get(key2))
  }
}