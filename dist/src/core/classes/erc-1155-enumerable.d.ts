import { ContractWrapper } from "./contract-wrapper";
import { IERC1155Enumerable } from "contracts";
import { BigNumber, BigNumberish } from "ethers";
import { QueryAllParams } from "../../types";
import { EditionMetadata, EditionMetadataOwner } from "../../schema";
import { Erc1155 } from "./erc-1155";
import { BaseERC1155 } from "../../types/eips";
import { DetectableFeature } from "../interfaces/DetectableFeature";
/**
 * List ERC1155 NFTs
 * @remarks Easily list all the NFTs in a ERC1155 contract.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const nfts = await contract.edition.query.all();
 * ```
 * @public
 */
export declare class Erc1155Enumerable implements DetectableFeature {
    featureName: "ERC1155Enumerable";
    private contractWrapper;
    private erc1155;
    constructor(erc1155: Erc1155, contractWrapper: ContractWrapper<BaseERC1155 & IERC1155Enumerable>);
    /**
     * Get All NFTs
     *
     * @remarks Get all the data associated with every NFT in this contract.
     *
     * By default, returns the first 100 NFTs, use queryParams to fetch more.
     *
     * @example
     * ```javascript
     * const nfts = await contract.edition.query.all();
     * ```
     * @param queryParams - optional filtering to only fetch a subset of results.
     * @returns The NFT metadata for all NFTs queried.
     */
    all(queryParams?: QueryAllParams): Promise<EditionMetadata[]>;
    /**
     * Get the number of NFTs minted
     * @remarks This returns the total number of NFTs minted in this contract, **not** the total supply of a given token.
     *
     * @returns the total number of NFTs minted in this contract
     * @public
     */
    totalCount(): Promise<BigNumber>;
    /**
     * Get the supply of token for a given tokenId.
     * @remarks This is **not** the sum of supply of all NFTs in the contract.
     *
     * @returns the total number of NFTs minted in this contract
     * @public
     */
    totalCirculatingSupply(tokenId: BigNumberish): Promise<BigNumber>;
    /**
     * Get Owned NFTs
     *
     * @remarks Get all the data associated with the NFTs owned by a specific wallet.
     *
     * @example
     * ```javascript
     * // Address of the wallet to get the NFTs of
     * const address = "{{wallet_address}}";
     * const nfts = await contract.edition.query.owned(address);
     * ```
     *
     * @returns The NFT metadata for all NFTs in the contract.
     */
    owned(walletAddress?: string): Promise<EditionMetadataOwner[]>;
}
