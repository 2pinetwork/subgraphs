import { ReferralPaid } from '../generated/Referral/Referral'
import { getBundle, saveHolder } from './helpers'
// import { log } from '@graphprotocol/graph-ts'

export function handleReferralPaid(event: ReferralPaid): void {
  let bundle = getBundle()

  bundle.totalRewards = bundle.totalRewards.plus(
    event.params.amount
  )

  bundle.save()

  let user = saveHolder(event.params.user.toHex())
  if (user) {
    user.referralsPaid = user.referralsPaid.plus(
      event.params.amount
    )

    user.save()
  }
}
