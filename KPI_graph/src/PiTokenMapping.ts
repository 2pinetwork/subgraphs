import { ethereum } from "@graphprotocol/graph-ts"
import { Transfer, Minted, Burned } from '../generated/2Pi/PiToken'
import { PiToken } from '../generated/schema'
import {
  STK_PI_ADDRESS,
  BIG_DECIMAL_1E18,
  ZERO_ADDRESS,
  IPiToken,
} from './constants'
import { piPrice, getBundle, idForEvent, saveHolder } from './helpers'
// import { log } from '@graphprotocol/graph-ts'

export function handleTransfer(event: Transfer): void {
  const to = event.params.to.toHex()
  const from = event.params.from.toHex()

  if (from != ZERO_ADDRESS.toHex()) { saveHolder(from) }
  if (to != ZERO_ADDRESS.toHex()) { saveHolder(to) }

  recordEvent(event)
}

export function handleMint(event: Minted): void {
  recordEvent(event)
}

export function handleBurn(event: Burned): void {
  recordEvent(event)
}

function recordEvent(event: ethereum.Event): void {
  let token = new PiToken(idForEvent(event))
  let bundle = getBundle()

  token.totalSupply = IPiToken.totalSupply()
  token.totalStaked = IPiToken.balanceOf(STK_PI_ADDRESS)

  bundle.priceUSD = piPrice().truncate(4)

  token.priceUSD = bundle.priceUSD
  token.holders = bundle.holdersCount

  token.marketCap = token.totalSupply.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  token.stakedTVL = token.totalStaked.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  token.timestamp = event.block.timestamp

  bundle.marketCap = token.marketCap
  bundle.stakedTVL = token.stakedTVL

  bundle.save()
  token.save()
}
