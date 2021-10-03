import { Address, BigInt, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { Holder, Bundle } from '../generated/schema'
import {
  BIG_DECIMAL_1E18,
  BIG_INT_0,
  BIG_INT_1,
  IPiToken,
  IStk2Pi
} from './constants'
// import { log } from '@graphprotocol/graph-ts'


export function getFullBalance(addr: String): BigInt {
  const mantisa = BigInt.fromString(BIG_DECIMAL_1E18.toString())
  const address = Address.fromString(addr)

  const balanceResult = IStk2Pi.try_balanceOf(address)

  let stkBalance = BIG_INT_0
  let pricePerShare = mantisa

  if (!balanceResult.reverted) {
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
    bundle.save()
  }

  return bundle
}

export function saveHolder(addr: String): (Holder | null) {
  if (addr == IPiToken._address.toHex()) {
    return null
  }

  let bundle = getBundle()
  let user = Holder.load(addr)
  let balance = getFullBalance(addr)

  if (user === null) {
    user = new Holder(addr)

    // that's a new user so we have to increase holders
    bundle.holdersCount = bundle.holdersCount.plus(BIG_INT_1)
    bundle.save()
  } else if (balance == BIG_INT_0) {
    // If balance == 0 the holder is already registerd so it should
    // ALWAYS exist as holder. So the only way to get balance 0
    // is to have been a holder and now transfer/to other
    bundle.holdersCount = bundle.holdersCount.minus(BIG_INT_1)
    bundle.save()
  }

  user.bundle = bundle.id
  user.amount = balance
  user.save()

  return user
}

export function idForEvent(event: ethereum.Event): String {
  return `${event.transaction.hash.toHex()}:${event.logIndex.toString()}`
}
