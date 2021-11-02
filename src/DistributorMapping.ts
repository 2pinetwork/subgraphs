import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { FoundersDistributed, } from '../generated/Distributor/Distributor'
import { IChainlink } from '../generated/Distributor/IChainlink'
import { KPI } from '../generated/schema'
import { BIG_INT_1, IArchimedes, ChainLinkOracles } from './constants'
import { getBundle, idForEvent, saveHolder } from './helpers'
import { log } from '@graphprotocol/graph-ts'


export function handleKPI(event: FoundersDistributed): void {
  const bundle = getBundle()

  let kpi = KPI.load(event.block.timestamp.toString())

  if (kpi == null) {
    kpi = new KPI(event.block.timestamp.toString())
  }

  kpi.marketCap = bundle.marketCap
  kpi.holders = bundle.holdersCount
  kpi.transactions = bundle.deposits.plus(bundle.withdraws)
  kpi.totalTVL = bundle.stakedTVL.plus(
    getTotalTVL()
  )

  kpi.save()
}

function getTotalTVL(): BigDecimal {
  const poolCall = IArchimedes.try_poolLength()
  let amount = BigDecimal.fromString('0')

  // Archimedes doesn't exist yet
  if (poolCall.reverted) {
    return amount
  }

  for (let i = BigInt.fromI32(0); i.lt(poolCall.value); i = i.plus(BigInt.fromI32(1))) {
    let poolInfo = IArchimedes.poolInfo(i)
    let oracleAddr: Address | null = ChainLinkOracles.get(poolInfo.value0)

    if (oracleAddr === null) {
      continue
    }

    let oracle = IChainlink.bind(oracleAddr)
    let price = oracle.latestRoundData().value1.toBigDecimal().div(
      BigDecimal.fromString(oracle.decimals().toString())
    )

    amount = amount.plus(
      IArchimedes.balance(i).toBigDecimal().times(price).div(
        BigDecimal.fromString(IArchimedes.decimals(i).toString())
      )
    )
  }

  return amount
}
