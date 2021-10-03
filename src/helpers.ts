import { Address, BigInt, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { Holder, Bundle } from '../generated/schema'
import { log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E18,
  IPiToken,
  IStk2Pi
} from './constants'


export function getFullBalance(addr: String): BigInt {
  const mantisa = BigInt.fromString(BIG_DECIMAL_1E18.toString())
  const address = Address.fromString(addr)

  const balanceResult = IStk2Pi.try_balanceOf(address)

  let stkBalance: BigInt
  let pricePerShare: BigInt

  if (balanceResult.reverted) {
    stkBalance = BigInt.fromString('0')
    pricePerShare = mantisa
  } else {

    stkBalance = balanceResult.value
    pricePerShare = IStk2Pi.getPricePerFullShare()
  }

  return IPiToken.balanceOf(address).plus(
    stkBalance.times(pricePerShare).div(
      mantisa
    )
  )
}

export function getBundle(): Bundle {
  let bundle = Bundle.load('0')
  if (bundle === null) {
    bundle = new Bundle('0')
    // bundle.holders = new Array<string>()
    bundle.priceUSD = BigDecimal.fromString('0')
    bundle.save()
  }

  return bundle
}

export function saveHolder(addr: String): Holder {
  log.info("\n\n saveHolder 1 \n\n", [])
  let bundle = getBundle()

  log.info("SaveHolder con : {}", [addr])
  let user = Holder.load(addr)
  log.info("\n\n saveHolder 2 \n\n", [])

  if (user === null) {
    user = new Holder(addr)
  }
  log.info("User.id : {}", [user.id])

  log.info("\n\n saveHolder 3 \n\n", [])
  user.bundle = bundle.id
  user.amount = getFullBalance(user.id)
  user.save()
  log.info("\n\n saveHolder terminose \n\n", [])

  return user
}

export function idForEvent(event: ethereum.Event): String {
  return `${event.transaction.hash.toHex()}:${event.logIndex.toString()}`
}
