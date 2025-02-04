import type { TypedDataField } from "@ethersproject/abstract-signer";
import { Signer } from "ethers";
/**
 * @internal
 */
export interface EIP712StandardDomain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
}
/**
 * @internal
 */
export interface EIP712PolygonDomain {
    name: string;
    version: string;
    verifyingContract: string;
    salt: string;
}
/**
 * @internal
 */
export declare type EIP712Domain = EIP712StandardDomain | EIP712PolygonDomain;
/**
 * eip712 sign typed data with different wallet handling including ledger live
 * @internal
 */
export declare function signTypedDataInternal(signer: Signer, domain: EIP712Domain, types: Record<string, Array<TypedDataField>>, message: Record<string, any>): Promise<{
    payload: any;
    signature: string;
}>;
