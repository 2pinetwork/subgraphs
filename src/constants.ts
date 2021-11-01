import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { PiToken as InterfacePiToken } from '../generated/2Pi/PiToken'
import { Stk2Pi as InterfaceStk2Pi } from '../generated/2Pi/Stk2Pi'

export const BIG_DECIMAL_1E6 = BigDecimal.fromString('1e6')
export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const WETH_ADDRESS     = Address.fromString('0x3C68CE8504087f89c640D02d133646d98e64ddd9')
export const PI_TOKEN_ADDRESS = Address.fromString('0x9f9836AfB302FAf61F51a36A0eB79Bc95Be3DF6F')
export const STK_PI_ADDRESS   = Address.fromString('0xE52f94EBbaA0214521e83aE6b7f86Fc7bd0B080B')
export const WETH_USD_LP      = Address.fromString('0x9192dE80B91a8edd6489E5c8fabA2608Ed5b64aC')
export const PI_WETH_LP       = Address.fromString('0x6cbc53f4cae278752eaeb04ff6e6dc081cadc763')
export const ARCHIMEDES_ADDRESS = Address.fromString('0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38')
export const BIG_INT_0        = BigInt.fromString('0')
export const BIG_INT_1        = BigInt.fromString('1')
export const ZERO_ADDRESS     = '0x0000000000000000000000000000000000000000'

export const IPiToken = InterfacePiToken.bind(PI_TOKEN_ADDRESS)
export const IStk2Pi = InterfaceStk2Pi.bind(STK_PI_ADDRESS)
