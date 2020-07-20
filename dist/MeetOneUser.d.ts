import { Chain, SignTransactionConfig, SignTransactionResponse, User } from 'universal-authenticator-library';
import { Wallet } from './interfaces';
export declare class MeetOneUser extends User {
    private wallet;
    private keys;
    private chainId;
    constructor(chain: Chain | null, wallet: Wallet);
    signTransaction(transaction: any, config: SignTransactionConfig): Promise<SignTransactionResponse>;
    signArbitrary(publicKey: string, data: string, _helpText: string): Promise<string>;
    verifyKeyOwnership(_: string): Promise<boolean>;
    getAccountName(): Promise<string>;
    getChainId(): Promise<string>;
    getKeys(): Promise<string[]>;
}