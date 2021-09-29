import { Address, BigInt, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { Transfer, Minted, Burned } from '../generated/2Pi/PiToken'
import {LP} from '../generated/2Pi/LP'
import {ERC20} from '../generated/2Pi/ERC20'
import { PiToken } from '../generated/schema'
import { log } from '@graphprotocol/graph-ts'

export const BIG_DECIMAL_1E6 = BigDecimal.fromString('1e6')
export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const WETH_ADDRESS     = Address.fromString('0x68d02B807177b09318e8F87f1906086905eF13D5')
export const PI_TOKEN_ADDRESS = Address.fromString('0xF47b68068794A952467737871888c3F8d22a561b')
export const STK_PI_ADDRESS   = Address.fromString('0xBB1468ABbb437F115AfaC1Db84E4131E1F91DFeD')
export const WETH_USD_LP      = Address.fromString('0x420B00795c2A6cbfe73F9D5F9a7B6f29120D8d01')
export const PI_WETH_LP       = Address.fromString('0xABaf30e901f0bAeCDA840d94Dd44611F348D4cd2')

export function handleTransfer(event: Transfer): void {
  if (event.params.to == STK_PI_ADDRESS || event.params.from == STK_PI_ADDRESS) {
    saracatunga(event)
  }
}

function saracatunga(event: ethereum.Event): void {

  let token = new PiToken(event.transaction.hash.toHexString())
  const piToken = ERC20.bind(PI_TOKEN_ADDRESS)

  token.totalSupply = piToken.totalSupply()
  token.totalStaked = piToken.balanceOf(STK_PI_ADDRESS)

  if (event.block.number > BigInt.fromString('45')) {
    token.priceUSD = piPrice().truncate(4)
    log.info('Price con funcion is: {}', [token.priceUSD.toString()])
  } else {
    token.priceUSD = BigDecimal.fromString(
      '0.' + event.block.timestamp.toString().substr(-2)
    )
  }

  token.stakedTVL = token.totalStaked.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18)

  token.timestamp = event.block.timestamp

  token.save()
}

export function handleMint(event: Minted): void {
  saracatunga(event)
}

export function handleBurn(event: Burned): void {
  saracatunga(event)
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

// export function round(value: BigDecimal, precision: BigInt): BigDecimal {
//   // workaround for round
//   return BigDecimal.fromString(value.toPrecision(precision))
// }
