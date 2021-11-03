import { Address, BigDecimal, BigInt, ValueKind, ethereum } from "@graphprotocol/graph-ts"
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

  kpi.marketCap = bundle.marketCap.truncate(4)
  kpi.holders = bundle.holdersCount
  kpi.transactions = bundle.deposits.plus(bundle.withdraws)
  kpi.totalTVL = bundle.stakedTVL.plus(
    getTotalTVL()
  ).truncate(4)
  kpi.timestamp = event.block.timestamp
  kpi.score = calcKPIScore(kpi).truncate(6)

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
    amount = amount.plus(getPriceFromPool(i))
  }

  return amount
}

function getPriceFromPool(i: BigInt): BigDecimal {
  let poolInfo = IArchimedes.poolInfo(i)
  let oracleAddr: Address | null = ChainLinkOracles.get(poolInfo.value0)

  if (oracleAddr === null) {
    return getLPPrice(i, poolInfo.value0)
  } else {
    return getPriceFromChainlink(i, oracleAddr)
  }
}

function getPriceFromChainlink(i: BigInt, oracleAddr: Address): BigDecimal {
  let oracle = IChainlink.bind(oracleAddr)
  let oraclePrecision =  BigDecimal.fromString('1' + '0'.repeat(oracle.decimals()))
  let price = oracle.latestRoundData().value1.toBigDecimal().div(
    oraclePrecision
  )

  let poolPrecision = BigDecimal.fromString('1' + '0'.repeat(IArchimedes.decimals(i).toI32()))

  return IArchimedes.balance(i).toBigDecimal().times(price).div(poolPrecision)
}

function getLPPrice(i: BigInt, lpAddr: Address): BigDecimal {
  return BigDecimal.fromString('0')
}

function calcKPIScore(kpi: KPI): BigDecimal {
  let score = BigDecimal.fromString('0')

  // This should change/improve for the next tranches
  let kpiData = new Map<string,Array<BigDecimal>>()
  kpiData.set('totalTVL',     [BigDecimal.fromString('0.4'), BigDecimal.fromString('10000000')]) // metric: [weight, expected]
  kpiData.set('marketCap',    [BigDecimal.fromString('0.4'), BigDecimal.fromString('15000000')])
  kpiData.set('holders',      [BigDecimal.fromString('0.1'), BigDecimal.fromString('2000')])
  kpiData.set('transactions', [BigDecimal.fromString('0.1'), BigDecimal.fromString('5000')])

  const METRICS = ['totalTVL', 'marketCap', 'holders', 'transactions']

  for (let i = 0; i < METRICS.length; i++) {
    let metric = METRICS[i]
    let kpiD = kpiData.get(metric)
    let kpiValue = kpi.get(metric)!
    let kpiBD: BigDecimal

    if (kpiValue.kind == ValueKind.BIGDECIMAL) {
      kpiBD = kpiValue.toBigDecimal()
    } else {
      kpiBD = kpiValue.toBigInt().toBigDecimal()
    }

    let rate = kpiBD.times(kpiD[0]).div(kpiD[1])

    if (rate.gt(kpiD[0])){ rate = kpiD[0] }

    score = score.plus(rate)
  }

  return score
}
