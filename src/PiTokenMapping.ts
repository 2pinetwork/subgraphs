import { Address, BigInt, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { Transfer, Minted, Burned } from '../generated/2Pi/PiToken'
import { LP as ILP } from '../generated/2Pi/LP'
import { PiToken, Holder, Bundle } from '../generated/schema'
import { log } from '@graphprotocol/graph-ts'
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

export function handleTransfer(event: Transfer): void {
  log.info("\n\n PASO 1\n\n", [])
  const to = event.params.to.toHex()
  const from = event.params.from.toHex()

  if (from != ZERO_ADDRESS) { saveHolder(from) }
  if (to != ZERO_ADDRESS) { saveHolder(to) }
  log.info("\n\n PASO 2\n\n", [])

  // let bundle = getBundle()
  // log.info("\n\n Despues del holders", [])
  // if (bundle.get('holders')) {
  //   log.info("\n\n {} \n\n", bundle.holders)
  // } else {
  //   let newBundle = getBundle()

  //   if (newBundle.get('holders')) {
  //     log.info("\n\n {} \n\n", newBundle.holders)
  //   } else {
  //     log.info("\n\n ni uno ni el otro \n\n", [])
  //   }
  // }

  // bundle.save()

  // log.info("\n\n Despues del holders", [])
  // if (bundle.get('holders')) {
  //   log.info("\n\n {} \n\n", bundle.holders)
  // } else {
  //   let newBundle = getBundle()

  //   if (newBundle.get('holders')) {
  //     log.info("\n\n {} \n\n", newBundle.holders)
  //   } else {
  //     log.info("\n\n ni uno ni el otro \n\n", [])
  //   }
  // }



  recordEvent(event)
  log.info("\n\n PASO 7\n\n", [])
  log.info("\n\n termino handleTransfer\n\n", [])
}

export function handleMint(event: Minted): void {
  log.info("\n\n termino handleMint\n\n", [])
  recordEvent(event)
}

export function handleBurn(event: Burned): void {
  recordEvent(event)
  log.info("\n\n termino handleBurn\n\n", [])
}

function recordEvent(event: ethereum.Event): void {
  let token = new PiToken(idForEvent(event))

  log.info("\n\n PASO 3\n\n", [])
  token.totalSupply = IPiToken.totalSupply()
  token.totalStaked = IPiToken.balanceOf(STK_PI_ADDRESS)

  if (event.block.number > BigInt.fromString('45')) {
    token.priceUSD = piPrice().truncate(4)
    log.info('Price con funcion is: {}', [token.priceUSD.toString()])
  } else {
    token.priceUSD = BigDecimal.fromString('0.08') // initial price
  }

  log.info("\n\n PASO 4\n\n", [])
  token.marketCap = token.totalSupply.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  token.stakedTVL = token.totalStaked.toBigDecimal().times(
    token.priceUSD
  ).div(BIG_DECIMAL_1E18).truncate(4)

  token.timestamp = event.block.timestamp
  log.info("\n\n PASO 5\n\n", [])


  // let bundle = getBundle()
  // log.info("\n\n Despues del holders", [])
  // if (bundle.get('holders')) {
  //   log.info("\n\n {} \n\n", bundle.holders)
  // } else {
  //   let newBundle = getBundle()

  //   if (newBundle.get('holders')) {
  //     log.info("\n\n {} \n\n", newBundle.holders)
  //   } else {
  //     log.info("\n\n ni uno ni el otro \n\n", [])
  //   }
  // }

  // // let chota: Array<string> = []
  // // let tuVieja: Array<string> = []

  // // try {
  // //   chota = bundle.holders
  // // } catch (e) { result = (e as Error).message}
  // // // const tuVieja = (bundle && bundle.holders) || chota

  // if (bundle.get('holders')) {
  // //   // log.info("\n\n bundle: {} \n\n", bundle.holders)
  //   for (let i = 0; i < bundle.holders.length; i++) {
  //     log.info("\n\n bundle: {} \n\n", [bundle.holders[i].toString()])
  //   }
  // }
  // }
  // }
  //   log.info("Holders: {} ", [bundle.holders[i]])
  //   if (bundle.holders[i].amount > 0) {
  //     token.holders = token.holders.plus(bundle.holders[i].amount)
  //   }
  // }

  token.save()
  log.info("\n\n PASO 6\n\n", [])
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
