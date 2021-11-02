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
import { log } from '@graphprotocol/graph-ts'

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
  log.info("LA CONCHA DE TU HNA 1", [])
  let token = new PiToken(idForEvent(event))
  log.info("LA CONCHA DE TU HNA 2", [])
  let bundle = getBundle()
  log.info("LA CONCHA DE TU HNA 3", [])

  token.totalSupply = IPiToken.totalSupply()
  token.totalStaked = IPiToken.balanceOf(STK_PI_ADDRESS)

  log.info("LA CONCHA DE TU HNA 4", [])
  if (event.block.number > BigInt.fromString('45')) {
    bundle.priceUSD = piPrice().truncate(4)
  } else {
    bundle.priceUSD = BigDecimal.fromString('0.08') // initial price
  }

  log.info("LA CONCHA DE TU HNA 5", [])
  token.priceUSD = bundle.priceUSD
  token.holders = bundle.holdersCount

  log.info("LA CONCHA DE TU HNA 6", [])
  token.marketCap = token.totalSupply.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  log.info("LA CONCHA DE TU HNA 7", [])
  token.stakedTVL = token.totalStaked.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  log.info("LA CONCHA DE TU HNA 8", [])
  token.timestamp = event.block.timestamp

  log.info("LA CONCHA DE TU HNA 9", [])
  // bundle.marketCap = token.marketCap
  // bundle.stakedTVL = token.stakedTVL

  log.info("LA CONCHA DE TU HNA 10", [])
  bundle.save()
  log.info("LA CONCHA DE TU HNA 11", [])
  token.save()
  log.info("LA CONCHA DE TU HNA 12", [])
}

export function ethPerPi(): BigDecimal {
  const piEthLP = ILP.bind(PI_WETH_LP)
  const reservesCall = piEthLP.try_getReserves()

  if (reservesCall.reverted) {
    return BigDecimal.fromString('0')
  }

  const reserves = reservesCall.value

  let eth =
    piEthLP.token0() == WETH_ADDRESS
      ? reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value1.toBigDecimal())
      : reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal())

  return eth.div(BIG_DECIMAL_1E18)
}

export function ethPrice(): BigDecimal {
  const ethUsd = ILP.bind(WETH_USD_LP)
  const reservesCall = ethUsd.try_getReserves()

  if (reservesCall.reverted) {
    return BigDecimal.fromString('0')
  }

  const reserves = reservesCall.value
  const reserve0 = reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18)
  const reserve1 = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18)

  return reserve1.div(reserve0).div(BIG_DECIMAL_1E6).times(BIG_DECIMAL_1E18)
}

export function piPrice(): BigDecimal {
  return ethPrice().times(ethPerPi())
}
