import { ethereum } from "@graphprotocol/graph-ts"
import { Deposit, Withdraw } from '../generated/Stk2Pi/Stk2Pi'
import { Movement } from '../generated/schema'
import { BIG_INT_1, STK_PI_ADDRESS, } from './constants'
import { getBundle, idForEvent, saveHolder } from './helpers'
import { log } from '@graphprotocol/graph-ts'

function createKind(event: ethereum.Event, kind: String): void {
  log.info("\n\n createKind 1 \n\n", [])
  const id = `${STK_PI_ADDRESS.toHex()}:${idForEvent(event)}`
  log.info("\n\n createKind 2 \n\n", [])
  let mov = new Movement(id)
  mov.kind = kind
  mov.timestamp = event.block.timestamp
  mov.save()
  log.info("\n\n createKind terminose \n\n", [])
}

export function handleDeposit(event: Deposit): void {
  log.info("\n\n handleDeposit 1 \n\n", [])
  createKind(event, "Deposit")

  const bundle = getBundle()
  log.info("\n\n handleDeposit 2 \n\n", [])

  bundle.deposits = bundle.deposits.plus(BIG_INT_1)
  bundle.save()

  log.info("\n\n handleDeposit 3 \n\n", [])
  log.info("Con hex: {}", [event.params.user.toHex()])

  saveHolder(event.params.user.toHex())
  log.info("\n\n termino handleDeposit\n\n", [])
}


export function handleWithdraw(event: Withdraw): void {
  createKind(event, "Withdraw")

  const bundle = getBundle()

  bundle.withdraws = bundle.withdraws.plus(BIG_INT_1)
  bundle.save()

  saveHolder(event.params.user.toHex())
  log.info("\n\n termino handleWithdraw\n\n", [])
}
