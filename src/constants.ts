import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { PiToken as InterfacePiToken } from '../generated/2Pi/PiToken'
import { Stk2Pi as InterfaceStk2Pi } from '../generated/2Pi/Stk2Pi'

export const BIG_DECIMAL_1E6 = BigDecimal.fromString('1e6')
export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const WETH_ADDRESS     = Address.fromString('0x68d02B807177b09318e8F87f1906086905eF13D5')
export const PI_TOKEN_ADDRESS = Address.fromString('0xF47b68068794A952467737871888c3F8d22a561b')
export const STK_PI_ADDRESS   = Address.fromString('0xBB1468ABbb437F115AfaC1Db84E4131E1F91DFeD')
export const WETH_USD_LP      = Address.fromString('0x420B00795c2A6cbfe73F9D5F9a7B6f29120D8d01')
export const PI_WETH_LP       = Address.fromString('0xABaf30e901f0bAeCDA840d94Dd44611F348D4cd2')
export const BIG_INT_0        = BigInt.fromString('0')
export const BIG_INT_1        = BigInt.fromString('1')
export const ZERO_ADDRESS     = '0x0000000000000000000000000000000000000000'

export const IPiToken = InterfacePiToken.bind(PI_TOKEN_ADDRESS)
export const IStk2Pi = InterfaceStk2Pi.bind(STK_PI_ADDRESS)
