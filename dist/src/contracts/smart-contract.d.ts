import { ContractMetadata } from "../core/classes/contract-metadata";
import { IStorage, NetworkOrSignerOrProvider } from "../core";
import { ContractEvents } from "../core/classes/contract-events";
import { ContractInterceptor } from "../core/classes/contract-interceptor";
import { ContractPrimarySale } from "../core/classes/contract-sales";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractRoyalty } from "../core/classes/contract-royalty";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import { Erc1155 } from "../core/classes/erc-1155";
import { Erc20 } from "../core/classes/erc-20";
import { Erc721 } from "../core/classes/erc-721";
import { SDKOptions } from "../schema/sdk-options";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { IPermissionsEnumerable, IPlatformFee, IPrimarySale, IRoyalty } from "contracts";
import { UpdateableNetwork } from "../core/interfaces/contract";
import { BaseContract, CallOverrides, ContractInterface } from "ethers";
import { ContractPlatformFee } from "../core/classes/contract-platform-fee";
import { ContractPublishedMetadata } from "../core/classes/contract-published-metadata";
/**
 * Custom contract dynamic class with feature detection
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK(provider);
 * const contract = await sdk.getContract("{{contract_address}}");
 *
 * // call any function in your contract
 * await contract.call("myCustomFunction", param1, param2);
 *
 * // if your contract follows the ERC721 standard, contract.nft will be present
 * const allNFTs = await contract.nft.query.all()
 *
 * // if your contract extends IMintableERC721, contract.nft.mint will be present
 * const tx = await contract.nft.mint.to("0x...", {
 *     name: "Cool NFT",
 *     image: readFileSync("some_image.png"),
 *   });
 * ```
 *
 * @beta
 */
export declare class SmartContract<TContract extends BaseContract = BaseContract> implements UpdateableNetwork {
    static contractType: "custom";
    /**
     * @internal
     */
    static schema: {
        deploy: import("zod").ZodObject<import("zod").extendShape<import("zod").extendShape<{
            name: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            image: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodTypeAny, import("zod").ZodString]>>;
            external_link: import("zod").ZodOptional<import("zod").ZodString>;
        }, {
            merkle: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodString>>>;
            seller_fee_basis_points: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            fee_recipient: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodEffects<import("zod").ZodString, string, string>>>;
            symbol: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodString>>>;
        }>, {
            primary_sale_recipient: import("zod").ZodOptional<import("zod").ZodEffects<import("zod").ZodString, string, string>>;
            platform_fee_basis_points: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            platform_fee_recipient: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodEffects<import("zod").ZodString, string, string>>>;
            trusted_forwarders: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodArray<import("zod").ZodEffects<import("zod").ZodString, string, string>, "many">>>;
        }>, "strip", import("zod").ZodLazy<import("zod").ZodType<import("../core").Json, import("zod").ZodTypeDef, import("../core").Json>>, {
            [x: string]: import("../core").Json;
            symbol?: string | undefined;
            description?: string | undefined;
            merkle?: Record<string, string> | undefined;
            image?: any;
            external_link?: string | undefined;
            seller_fee_basis_points?: number | undefined;
            fee_recipient?: string | undefined;
            primary_sale_recipient?: string | undefined;
            platform_fee_basis_points?: number | undefined;
            platform_fee_recipient?: string | undefined;
            trusted_forwarders?: string[] | undefined;
            name: string;
        }, {
            [x: string]: import("../core").Json;
            symbol?: string | undefined;
            description?: string | undefined;
            merkle?: Record<string, string> | undefined;
            image?: any;
            external_link?: string | undefined;
            seller_fee_basis_points?: number | undefined;
            fee_recipient?: string | undefined;
            primary_sale_recipient?: string | undefined;
            platform_fee_basis_points?: number | undefined;
            platform_fee_recipient?: string | undefined;
            trusted_forwarders?: string[] | undefined;
            name: string;
        }>;
        output: import("zod").ZodObject<import("zod").extendShape<import("zod").extendShape<{
            name: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            image: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodTypeAny, import("zod").ZodString]>>;
            external_link: import("zod").ZodOptional<import("zod").ZodString>;
        }, {
            image: import("zod").ZodOptional<import("zod").ZodString>;
        }>, {
            merkle: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodString>>>;
            seller_fee_basis_points: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            fee_recipient: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodEffects<import("zod").ZodString, string, string>>>;
            symbol: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodString>>>;
        }>, "strip", import("zod").ZodLazy<import("zod").ZodType<import("../core").Json, import("zod").ZodTypeDef, import("../core").Json>>, {
            [x: string]: import("../core").Json;
            symbol?: string | undefined;
            description?: string | undefined;
            merkle?: Record<string, string> | undefined;
            image?: string | undefined;
            external_link?: string | undefined;
            seller_fee_basis_points?: number | undefined;
            fee_recipient?: string | undefined;
            name: string;
        }, {
            [x: string]: import("../core").Json;
            symbol?: string | undefined;
            description?: string | undefined;
            merkle?: Record<string, string> | undefined;
            image?: string | undefined;
            external_link?: string | undefined;
            seller_fee_basis_points?: number | undefined;
            fee_recipient?: string | undefined;
            name: string;
        }>;
        input: import("zod").ZodObject<import("zod").extendShape<{
            name: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            image: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodTypeAny, import("zod").ZodString]>>;
            external_link: import("zod").ZodOptional<import("zod").ZodString>;
        }, {
            merkle: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodString>>>;
            seller_fee_basis_points: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodNumber>>;
            fee_recipient: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodEffects<import("zod").ZodString, string, string>>>;
            symbol: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodString>>>;
        }>, "strip", import("zod").ZodLazy<import("zod").ZodType<import("../core").Json, import("zod").ZodTypeDef, import("../core").Json>>, {
            [x: string]: import("../core").Json;
            symbol?: string | undefined;
            description?: string | undefined;
            merkle?: Record<string, string> | undefined;
            image?: any;
            external_link?: string | undefined;
            seller_fee_basis_points?: number | undefined;
            fee_recipient?: string | undefined;
            name: string;
        }, {
            [x: string]: import("../core").Json;
            symbol?: string | undefined;
            description?: string | undefined;
            merkle?: Record<string, string> | undefined;
            image?: any;
            external_link?: string | undefined;
            seller_fee_basis_points?: number | undefined;
            fee_recipient?: string | undefined;
            name: string;
        }>;
    };
    private contractWrapper;
    private storage;
    private options;
    events: ContractEvents<TContract>;
    interceptor: ContractInterceptor<TContract>;
    estimator: GasCostEstimator<TContract>;
    publishedMetadata: ContractPublishedMetadata<TContract>;
    metadata: ContractMetadata<BaseContract, any>;
    royalties: ContractRoyalty<IRoyalty, any> | undefined;
    roles: ContractRoles<IPermissionsEnumerable, any> | undefined;
    sales: ContractPrimarySale<IPrimarySale> | undefined;
    platformFees: ContractPlatformFee<IPlatformFee> | undefined;
    /**
     * Auto-detects ERC20 standard functions.
     */
    token: Erc20 | undefined;
    /**
     * Auto-detects ERC721 standard functions.
     */
    nft: Erc721 | undefined;
    /**
     * Auto-detects ERC1155 standard functions.
     */
    edition: Erc1155 | undefined;
    constructor(network: NetworkOrSignerOrProvider, address: string, abi: ContractInterface, storage: IStorage, options?: SDKOptions, contractWrapper?: ContractWrapper<TContract>);
    onNetworkUpdated(network: NetworkOrSignerOrProvider): void;
    getAddress(): string;
    /**
     * Call any function on this contract
     * @example
     * ```javascript
     * // read functions will return the data from the contract
     * const myValue = await contract.call("myReadFunction");
     * console.log(myValue);
     *
     * // write functions will return the transaction receipt
     * const tx = await contract.call("myWriteFunction", arg1, arg2);
     * const receipt = tx.receipt;
     *
     * // Optionally override transaction options
     * await contract.call("myWriteFunction", arg1, arg2, {
     *  gasLimit: 1000000, // override default gas limit
     *  value: ethers.utils.parseEther("0.1"), // send 0.1 ether with the contract call
     * };
     * ```
     * @param functionName - the name of the function to call
     * @param args - the arguments of the function
     */
    call(functionName: string, ...args: unknown[] | [...unknown[], CallOverrides]): Promise<any>;
    /** ********************
     * FEATURE DETECTION
     * ********************/
    private detectRoyalties;
    private detectRoles;
    private detectPrimarySales;
    private detectPlatformFees;
    private detectErc20;
    private detectErc721;
    private detectErc1155;
}
