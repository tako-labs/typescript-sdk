import { BigNumber, BigNumberish, providers } from "ethers";
import { NFTMetadata, NFTMetadataOrUri } from "../schema/tokens/common";
import type { IStorage } from "../core";
import { UploadProgressEvent } from "../types/index";
/**
 * fetches the token metadata
 * @param tokenId - the id (to get it back in the output)
 * @param tokenUri - the uri to fetch
 * @param storage - which storage to fetch from
 *
 * @internal
 */
export declare function fetchTokenMetadata(tokenId: BigNumberish, tokenUri: string, storage: IStorage): Promise<NFTMetadata>;
/**
 * @internal
 * @param contractAddress
 * @param provider
 * @param tokenId
 * @param storage
 */
export declare function fetchTokenMetadataForContract(contractAddress: string, provider: providers.Provider, tokenId: BigNumberish, storage: IStorage): Promise<{
    [x: string]: import("../core").Json;
    name?: string | undefined;
    description?: string | null | undefined;
    image?: string | null | undefined;
    external_url?: string | null | undefined;
    animation_url?: string | null | undefined;
    uri: string;
    id: BigNumber;
}>;
/**
 * @internal
 * @param metadata
 * @param storage
 */
export declare function uploadOrExtractURI(metadata: NFTMetadataOrUri, storage: IStorage): Promise<string>;
/**
 * @internal
 * @param metadatas
 * @param storage
 * @param startNumber
 * @param contractAddress
 * @param signerAddress
 * @param options
 */
export declare function uploadOrExtractURIs(metadatas: NFTMetadataOrUri[], storage: IStorage, startNumber?: number, contractAddress?: string, signerAddress?: string, options?: {
    onProgress: (event: UploadProgressEvent) => void;
}): Promise<string[]>;
