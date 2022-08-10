import { BigNumber, BigNumberish, Contract, ethers, providers } from "ethers";
import {
  CommonNFTInput,
  CommonNFTOutput,
  NFTMetadata,
  NFTMetadataInput,
  NFTMetadataOrUri,
} from "../schema/tokens/common";
import type { IStorage } from "../core";
import { IERC1155Metadata, IERC165, IERC721Metadata } from "contracts";
import { NotFoundError } from "./error";
import {
  InterfaceId_IERC1155,
  InterfaceId_IERC721,
} from "../constants/contract";
import ERC721MetadataAbi from "../../abis/IERC721Metadata.json";
import ERC1155MetadataAbi from "../../abis/IERC1155Metadata.json";
import ERC165MetadataAbi from "../../abis/IERC165.json";
import { UploadProgressEvent } from "../types/index";

const FALLBACK_METADATA = {
  name: "Failed to load NFT metadata",
};
// const regex = /ipfs/i;
/**
 * fetches the token metadata
 * @param tokenId - the id (to get it back in the output)
 * @param tokenUri - the uri to fetch
 * @param storage - which storage to fetch from
 *
 * @internal
 */
export async function fetchTokenMetadata(
  tokenId: BigNumberish,
  tokenUri: string,
  storage: IStorage,
): Promise<NFTMetadata> {
  const _tokenUri = tokenUri.replaceAll("ipfs/", "");
  let parsedUri = _tokenUri.replace(
    "{id}",
    ethers.utils.hexZeroPad(BigNumber.from(tokenId).toHexString(), 32).slice(2),
  );
  let jsonMetadata = {};
  try {
    jsonMetadata = await storage.get(parsedUri);
  } catch (err) {
    console.warn(
      `failed to get token metadata: ${JSON.stringify({
        tokenId,
        _tokenUri,
      })} -- falling back to default metadata`,
      err,
    );
    jsonMetadata = FALLBACK_METADATA;
  }

  return CommonNFTOutput.parse({
    id: BigNumber.from(tokenId),
    ...jsonMetadata,
    uri: _tokenUri,
  });
}

// Used for marketplace to fetch NFT metadata from contract address + tokenId
/**
 * @internal
 * @param contractAddress
 * @param provider
 * @param tokenId
 * @param storage
 */
export async function fetchTokenMetadataForContract(
  contractAddress: string,
  provider: providers.Provider,
  tokenId: BigNumberish,
  storage: IStorage,
) {
  let uri: string | undefined;
  const erc165 = new Contract(
    contractAddress,
    ERC165MetadataAbi,
    provider,
  ) as IERC165;
  const isERC721 = await erc165.supportsInterface(InterfaceId_IERC721);
  const isERC1155 = await erc165.supportsInterface(InterfaceId_IERC1155);
  if (isERC721) {
    const erc721 = new Contract(
      contractAddress,
      ERC721MetadataAbi,
      provider,
    ) as IERC721Metadata;
    uri = await erc721.tokenURI(tokenId);
  } else if (isERC1155) {
    const erc1155 = new Contract(
      contractAddress,
      ERC1155MetadataAbi,
      provider,
    ) as IERC1155Metadata;
    uri = await erc1155.uri(tokenId);
  } else {
    throw Error("Contract must implement ERC 1155 or ERC 721.");
  }
  if (!uri) {
    throw new NotFoundError();
  }
  return fetchTokenMetadata(tokenId, uri, storage);
}

/**
 * @internal
 * @param metadata
 * @param storage
 */
export async function uploadOrExtractURI(
  metadata: NFTMetadataOrUri,
  storage: IStorage,
): Promise<string> {
  if (typeof metadata === "string") {
    return metadata;
  } else {
    return await storage.uploadMetadata(CommonNFTInput.parse(metadata));
  }
}

/**
 * @internal
 * @param metadatas
 * @param storage
 * @param startNumber
 * @param contractAddress
 * @param signerAddress
 * @param options
 */
export async function uploadOrExtractURIs(
  metadatas: NFTMetadataOrUri[],
  storage: IStorage,
  startNumber?: number,
  contractAddress?: string,
  signerAddress?: string,
  options?: {
    onProgress: (event: UploadProgressEvent) => void;
  },
): Promise<string[]> {
  if (isUriList(metadatas)) {
    return metadatas;
  } else if (isMetadataList(metadatas)) {
    const { uris } = await storage.uploadMetadataBatch(
      metadatas.map((m) => CommonNFTInput.parse(m)),
      startNumber,
      contractAddress,
      signerAddress,
      options,
    );
    return uris;
  } else {
    throw new Error(
      "NFT metadatas must all be of the same type (all URI or all NFTMetadataInput)",
    );
  }
}

function isUriList(metadatas: NFTMetadataOrUri[]): metadatas is string[] {
  return metadatas.find((m) => typeof m !== "string") === undefined;
}

function isMetadataList(
  metadatas: NFTMetadataOrUri[],
): metadatas is NFTMetadataInput[] {
  return metadatas.find((m) => typeof m !== "object") === undefined;
}
