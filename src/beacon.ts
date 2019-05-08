import koaRouter from 'koa-router'
import { saveBeacon } from './utils/beacon-utils'

import { navPerfTimingHandler } from '@/handlers'

export const beacon = new koaRouter()

export interface IBeaconData {
  appId: string
  name: string
  record: string | object
  timestamp: string
}
const beaconHandlers = {
  nav_timing: navPerfTimingHandler,
}
const getBeaconHandler = (name: string) => {
  const partialHandler = beaconHandlers[name]
  if (partialHandler) {
    return partialHandler
  } else {
    return ([...args]) => false
  }
}

beacon.post('/', async ctx => {
  const { request } = ctx
  const { record, name, appId, timestamp } = request.body
  const beaconHandler = getBeaconHandler(name)

  saveBeacon({
    appId,
    name,
    record: beaconHandler(record),
    timestamp
  })

  ctx.body = { name }
})
