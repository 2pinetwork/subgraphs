import { BigInt, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { Transfer, Minted, Burned } from '../generated/2Pi/PiToken'
import {LP} from '../generated/2Pi/LP'
import {ERC20} from '../generated/2Pi/ERC20'
import { PiToken } from '../generated/schema'
import { log } from '@graphprotocol/graph-ts'
import {
  PI_TOKEN_ADDRESS,
  STK_PI_ADDRESS,
  WETH_ADDRESS,
  WETH_USD_LP,
  PI_WETH_LP,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
} from './constants'


export function handleTransfer(event: Transfer): void {
  if (event.params.to == STK_PI_ADDRESS || event.params.from == STK_PI_ADDRESS) {
    recordEvent(event)
  }
}

export function handleMint(event: Minted): void {
  recordEvent(event)
}

export function handleBurn(event: Burned): void {
  recordEvent(event)
}

function recordEvent(event: ethereum.Event): void {
  const token = new PiToken(event.transaction.hash.toHexString())

  const piToken = ERC20.bind(PI_TOKEN_ADDRESS)

  token.totalSupply = piToken.totalSupply()
  token.totalStaked = piToken.balanceOf(STK_PI_ADDRESS)

  if (event.block.number > BigInt.fromString('45')) {
    token.priceUSD = piPrice().truncate(4)
    log.info('Price con funcion is: {}', [token.priceUSD.toString()])
  } else {
    token.priceUSD = BigDecimal.fromString('0.08') // initial price
  }

  token.marketCap = token.totalSupply.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  token.stakedTVL = token.totalStaked.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  token.timestamp = event.block.timestamp

  token.save()
}


export function ethPerPi(): BigDecimal {
  const piEthLP = LP.bind(PI_WETH_LP)
  const reserves = piEthLP.getReserves()

  let eth =
    piEthLP.token0() == WETH_ADDRESS
      ? reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value1.toBigDecimal())
      : reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal())

  return eth.div(BIG_DECIMAL_1E18)
}

export function ethPrice(): BigDecimal {
  const ethUsd = LP.bind(WETH_USD_LP)
  const reserves = ethUsd.getReserves()
  const reserve0 = reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18)
  const reserve1 = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18)

  return reserve1.div(reserve0).div(BIG_DECIMAL_1E6).times(BIG_DECIMAL_1E18)
}

export function piPrice(): BigDecimal {
  return ethPrice().times(ethPerPi())
}
