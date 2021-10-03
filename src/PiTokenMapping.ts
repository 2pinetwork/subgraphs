import { Address, BigInt, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { Transfer, Minted, Burned } from '../generated/2Pi/PiToken'
import { LP as ILP } from '../generated/2Pi/LP'
import { PiToken, Holder, Bundle } from '../generated/schema'
import {
  PI_TOKEN_ADDRESS,
  STK_PI_ADDRESS,
  WETH_ADDRESS,
  WETH_USD_LP,
  PI_WETH_LP,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  ZERO_ADDRESS,
  IPiToken,
  IStk2Pi,
} from './constants'
import { getBundle, idForEvent, saveHolder } from './helpers'
// import { log } from '@graphprotocol/graph-ts'

export function handleTransfer(event: Transfer): void {
  const to = event.params.to.toHex()
  const from = event.params.from.toHex()

  if (from != ZERO_ADDRESS) { saveHolder(from) }
  if (to != ZERO_ADDRESS) { saveHolder(to) }

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

  if (event.block.number > BigInt.fromString('45')) {
    bundle.priceUSD = piPrice().truncate(4)
  } else {
    bundle.priceUSD = BigDecimal.fromString('0.08') // initial price
  }

  token.priceUSD = bundle.priceUSD
  token.holders = bundle.holdersCount

  token.marketCap = token.totalSupply.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  token.stakedTVL = token.totalStaked.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  token.timestamp = event.block.timestamp

  bundle.save()
  token.save()
}

export function ethPerPi(): BigDecimal {
  const piEthLP = ILP.bind(PI_WETH_LP)
  const reserves = piEthLP.getReserves()

  let eth =
    piEthLP.token0() == WETH_ADDRESS
      ? reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value1.toBigDecimal())
      : reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal())

  return eth.div(BIG_DECIMAL_1E18)
}

export function ethPrice(): BigDecimal {
  const ethUsd = ILP.bind(WETH_USD_LP)
  const reserves = ethUsd.getReserves()
  const reserve0 = reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18)
  const reserve1 = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18)

  return reserve1.div(reserve0).div(BIG_DECIMAL_1E6).times(BIG_DECIMAL_1E18)
}

export function piPrice(): BigDecimal {
  return ethPrice().times(ethPerPi())
}
