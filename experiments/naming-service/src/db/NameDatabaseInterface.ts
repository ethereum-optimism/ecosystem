import { getName } from '../models'
import type { DatabaseInterface } from '../Service'
import type { Database } from './Database'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const EMPTY_CONTENT_HASH = '0x'

export class NameDatabaseInterface implements DatabaseInterface {
  ttl: number
  db: Database

  constructor(db: Database, ttl: number) {
    this.ttl = ttl
    this.db = db
  }

  async addr(name: string, coinType: number) {
    const nameData = await getName(this.db, name)
    if (!nameData || !nameData.addresses || !nameData.addresses[coinType]) {
      return { addr: ZERO_ADDRESS, ttl: this.ttl }
    }
    return { addr: nameData.addresses[coinType], ttl: this.ttl }
  }

  async text(_: string, __: string) {
    return { value: '', ttl: this.ttl }
  }

  async contenthash(name: string) {
    const nameData = await this.findName(name)
    if (!nameData || !nameData.contenthash) {
      return { contenthash: EMPTY_CONTENT_HASH, ttl: this.ttl }
    }
    return { contenthash: nameData.contenthash, ttl: this.ttl }
  }

  private async findName(name: string) {
    const nameData = await getName(this.db, name)
    if (nameData) {
      return nameData
    }

    const labels = name.split('.')

    for (let i = 1; i < labels.length + 1; i++) {
      name = ['*', ...labels.slice(i)].join('.')
      const nameData = await getName(this.db, name)
      if (nameData) {
        return nameData
      }
    }
    return null
  }
}
