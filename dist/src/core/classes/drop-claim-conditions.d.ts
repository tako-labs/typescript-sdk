import { IStorage } from "../interfaces/IStorage";
import { ContractMetadata } from "./contract-metadata";
import { DropERC20, DropERC721, SignatureDrop } from "contracts";
import { BigNumberish } from "ethers";
import { ContractWrapper } from "./contract-wrapper";
import { Amount, ClaimCondition, ClaimConditionInput, ClaimVerification } from "../../types";
import { ClaimEligibility } from "../../enums";
import { TransactionResult } from "../types";
import { BaseClaimConditionERC721 } from "../../types/eips";
/**
 * Manages claim conditions for NFT Drop contracts
 * @public
 */
export declare class DropClaimConditions<TContract extends DropERC721 | DropERC20 | BaseClaimConditionERC721 | SignatureDrop> {
    private contractWrapper;
    private metadata;
    private storage;
    constructor(contractWrapper: ContractWrapper<TContract>, metadata: ContractMetadata<TContract, any>, storage: IStorage);
    /** ***************************************
     * READ FUNCTIONS
     *****************************************/
    /**
     * Get the currently active claim condition
     *
     * @returns the claim condition metadata
     */
    getActive(): Promise<ClaimCondition>;
    private get;
    /**
     * Get all the claim conditions
     *
     * @returns the claim conditions metadata
     */
    getAll(): Promise<ClaimCondition[]>;
    /**
     * Can Claim
     *
     * @remarks Check if the drop can currently be claimed.
     *
     * @example
     * ```javascript
     * // Quantity of tokens to check claimability of
     * const quantity = 1;
     * const canClaim = await contract.canClaim(quantity);
     * ```
     */
    canClaim(quantity: Amount, addressToCheck?: string): Promise<boolean>;
    /**
     * For any claim conditions that a particular wallet is violating,
     * this function returns human readable information about the
     * breaks in the condition that can be used to inform the user.
     *
     * @param quantity - The desired quantity that would be claimed.
     * @param addressToCheck - The wallet address, defaults to the connected wallet.
     *
     */
    getClaimIneligibilityReasons(quantity: Amount, addressToCheck?: string): Promise<ClaimEligibility[]>;
    /** ***************************************
     * WRITE FUNCTIONS
     *****************************************/
    /**
     * Set public mint conditions
     *
     * @remarks Sets the public mint conditions that need to be fullfiled by users to claim NFTs.
     *
     * @example
     * ```javascript
     * const presaleStartTime = new Date();
     * const publicSaleStartTime = new Date(Date.now() + 60 * 60 * 24 * 1000);
     *
     * // Optionally specify addresses that can claim
     * const snapshots = ['0x...', '0x...']
     *
     * // Or alternatively, you can pass snapshots with the max number of NFTs each address can claim
     * // const snapshots = [{ address: '0x...', maxClaimable: 1 }, { address: '0x...', maxClaimable: 2 }]
     *
     * const claimConditions = [
     *   {
     *     startTime: presaleStartTime, // start the presale now
     *     maxQuantity: 2, // limit how many mints for this presale
     *     price: 0.01, // presale price
     *     snapshot: snapshots, // limit minting to only certain addresses
     *   },
     *   {
     *     startTime: publicSaleStartTime, // 24h after presale, start public sale
     *     price: 0.08, // public sale price
     *   }
     * ]);
     *
     * await dropContract.claimConditions.set(claimConditions);
     * ```
     *
     * @param claimConditionInputs - The claim conditions
     * @param resetClaimEligibilityForAll - Whether to reset the state of who already claimed NFTs previously
     */
    set(claimConditionInputs: ClaimConditionInput[], resetClaimEligibilityForAll?: boolean): Promise<TransactionResult>;
    /**
     * Update a single claim condition with new data.
     *
     * @param index - the index of the claim condition to update, as given by the index from the result of `getAll()`
     * @param claimConditionInput - the new data to update, previous data will be retained
     */
    update(index: number, claimConditionInput: ClaimConditionInput): Promise<TransactionResult>;
    /** ***************************************
     * PRIVATE FUNCTIONS
     *****************************************/
    private getTokenDecimals;
    /**
     * Returns proofs and the overrides required for the transaction.
     *
     * @returns - `overrides` and `proofs` as an object.
     * @internal
     */
    prepareClaim(quantity: BigNumberish, checkERC20Allowance: boolean): Promise<ClaimVerification>;
    private isSinglePhaseDropContract;
    private isMultiPhaseDropContract;
}
