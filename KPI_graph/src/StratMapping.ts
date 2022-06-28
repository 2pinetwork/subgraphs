// import { ethereum } from "@graphprotocol/graph-ts"
import { BoostCall } from '../generated/2Pi/strat'
import { Boost } from '../generated/schema'

// import { log } from '@graphprotocol/graph-ts'

export function handleBoost(call: BoostCall): void {
  let boost = new Boost(call.transaction.hash.toHex())

  // log.info(`A ver: `, [])

  boost.boosted_at = call.block.timestamp
  boost.amount = call.inputs._amount

  boost.save()
}
