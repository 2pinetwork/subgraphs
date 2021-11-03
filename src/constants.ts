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

export const WETH_ADDRESS       = Address.fromString('0x3C68CE8504087f89c640D02d133646d98e64ddd9')
export const PI_TOKEN_ADDRESS   = Address.fromString('0x9f9836AfB302FAf61F51a36A0eB79Bc95Be3DF6F')
export const STK_PI_ADDRESS     = Address.fromString('0xE52f94EBbaA0214521e83aE6b7f86Fc7bd0B080B')
export const WETH_USD_LP        = Address.fromString('0x9192dE80B91a8edd6489E5c8fabA2608Ed5b64aC')
export const PI_WETH_LP         = Address.fromString('0x6cbc53f4cae278752eaeb04ff6e6dc081cadc763')
export const ARCHIMEDES_ADDRESS = Address.fromString('0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38')
export const LP_FACTORY_ADDRESS = Address.fromString('0xc35DADB65012eC5796536bD9864eD8773aBc74C4')
export const ZERO_ADDRESS       = Address.fromString('0x0000000000000000000000000000000000000000')

export const IPiToken = InterfacePiToken.bind(PI_TOKEN_ADDRESS)
export const IStk2Pi = InterfaceStk2Pi.bind(STK_PI_ADDRESS)
export const IArchimedes = InterfaceArchimedes.bind(ARCHIMEDES_ADDRESS)
export const ILPFactory = InterfaceFactory.bind(LP_FACTORY_ADDRESS)

export let ChainLinkOracles = new TypedMap<Address, Address>()
ChainLinkOracles.set(Address.fromString('0x0d787a4a1548f673ed375445535a6c7A1EE56180'), Address.fromString('0x007A22900a3B98143368Bd5906f8E17e9867581b'))
ChainLinkOracles.set(Address.fromString('0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F'), Address.fromString('0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046'))
ChainLinkOracles.set(Address.fromString('0x3C68CE8504087f89c640D02d133646d98e64ddd9'), Address.fromString('0x0715A7794a1dc8e42615F059dD6e406A6594651A'))
ChainLinkOracles.set(Address.fromString('0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'), Address.fromString('0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada'))
ChainLinkOracles.set(Address.fromString('0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'), Address.fromString('0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0'))
ChainLinkOracles.set(Address.fromString('0xBD21A10F619BE90d6066c941b04e340841F1F989'), Address.fromString('0x92C09849638959196E976289418e5973CC96d645'))
