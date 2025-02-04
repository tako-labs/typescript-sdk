import { ContractWrapper } from "./contract-wrapper";
import { IStorage } from "../interfaces";
import { AbiFunction, PublishedMetadata } from "../../schema/contracts/custom";
import { BaseContract } from "ethers";
/**
 * Handles publish metadata for a contract
 * @internal
 */
export declare class ContractPublishedMetadata<TContract extends BaseContract> {
    private contractWrapper;
    private storage;
    private _cachedMetadata;
    constructor(contractWrapper: ContractWrapper<TContract>, storage: IStorage);
    /**
     * Get the published metadata for this contract
     * @public
     */
    get(): Promise<PublishedMetadata>;
    /**
     * @public
     */
    extractFunctions(): Promise<AbiFunction[]>;
}
