import { Address, BigInt, BigDecimal, TypedMap } from "@graphprotocol/graph-ts"
import { PiToken as InterfacePiToken } from '../generated/2Pi/PiToken'
import { Stk2Pi as InterfaceStk2Pi } from '../generated/2Pi/Stk2Pi'
import { Archimedes as InterfaceArchimedes } from '../generated/Archimedes/Archimedes'
import { Factory as InterfaceFactory } from '../generated/Distributor/Factory'

export const BIG_DECIMAL_0    = BigDecimal.fromString('0')
export const BIG_DECIMAL_1E6  = BigDecimal.fromString('1e6')
export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')
export const BIG_INT_0        = BigInt.fromString('0')
export const BIG_INT_1        = BigInt.fromString('1')

export const WETH_ADDRESS       = Address.fromString('0x9668f5f55f2712Dd2dfa316256609b516292D554')
export const PI_TOKEN_ADDRESS   = Address.fromString('0x65881118D84006E0a7c5AAd9498C3949a2019e8E')
export const STK_PI_ADDRESS     = Address.fromString('0x5Bb392af72BDD2BBa6d66D77c6B6a21e5EC2d41A')
export const WETH_USD_LP        = Address.fromString('0x9D4d90E631a53dA61ce776eEf9CeB674657A6fE2')
export const PI_WETH_LP         = Address.fromString('0xae470f45829d7ad201595f05c3aaf589ef6af7ca')
export const ARCHIMEDES_ADDRESS = Address.fromString('0x280816D08695aF15c57F2C3A84ec240a08DC78eb')
export const LP_FACTORY_ADDRESS = Address.fromString('0xE4A575550C2b460d2307b82dCd7aFe84AD1484dd')
export const ZERO_ADDRESS       = Address.fromString('0x0000000000000000000000000000000000000000')

export const IPiToken = InterfacePiToken.bind(PI_TOKEN_ADDRESS)
export const IStk2Pi = InterfaceStk2Pi.bind(STK_PI_ADDRESS)
export const IArchimedes = InterfaceArchimedes.bind(ARCHIMEDES_ADDRESS)
export const ILPFactory = InterfaceFactory.bind(LP_FACTORY_ADDRESS)

export let ChainLinkOracles = new TypedMap<Address, Address>()
ChainLinkOracles.set(Address.fromString('0x9C1DCacB57ADa1E9e2D3a8280B7cfC7EB936186F'), Address.fromString('0x31CF013A08c6Ac228C94551d535d5BAfE19c602a')) // BTC
ChainLinkOracles.set(Address.fromString('0x51BC2DfB9D12d9dB50C855A5330fBA0faF761D15'), Address.fromString('0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad')) // DAI
ChainLinkOracles.set(Address.fromString('0x9668f5f55f2712Dd2dfa316256609b516292D554'), Address.fromString('0x86d67c3D38D2bCeE722E601025C25a575021c6EA')) // ETH
ChainLinkOracles.set(Address.fromString('0xd00ae08403B9bbb9124bB305C09058E32C39A48c'), Address.fromString('0x5498BB86BC934c8D34FDA08E81D444153d0D06aD')) // WNative
// ChainLinkOracles.set(Address.fromString(''), Address.fromString('')) // USDC
// ChainLinkOracles.set(Address.fromString(''), Address.fromString('')) // USDT
