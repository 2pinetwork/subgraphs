import { ethereum } from "@graphprotocol/graph-ts"
import { Deposit, EmergencyWithdraw, Withdraw } from '../generated/Archimedes/Archimedes'
import { Movement } from '../generated/schema'
import { BIG_INT_1, ARCHIMEDES_ADDRESS, } from './constants'
import { getBundle, idForEvent, saveHolder } from './helpers'
import { log } from '@graphprotocol/graph-ts'

function createKind(event: ethereum.Event, kind: String): void {
  const id = `${ARCHIMEDES_ADDRESS.toHex()}:${idForEvent(event)}`
  let mov = new Movement(id)
  mov.kind = kind
  mov.timestamp = event.block.timestamp
  mov.save()
}

export function handleDeposit(event: Deposit): void {
  createKind(event, "Deposit")

  const bundle = getBundle()

  bundle.deposits = bundle.deposits.plus(BIG_INT_1)
  bundle.save()

  // PiToken rewards
  saveHolder(event.params.user.toHex())
}

export function handleWithdraw(event: Withdraw): void {
  createKind(event, "Withdraw")

  const bundle = getBundle()

  bundle.withdraws = bundle.withdraws.plus(BIG_INT_1)
  bundle.save()

  // PiToken rewards
  saveHolder(event.params.user.toHex())
}

export function handleEmergencyWithdraw(event: EmergencyWithdraw): void {
  createKind(event, "Withdraw")

  const bundle = getBundle()

  bundle.withdraws = bundle.withdraws.plus(BIG_INT_1)
  bundle.save()
}
