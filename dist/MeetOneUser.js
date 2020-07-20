"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetOneUser = void 0;
const universal_authenticator_library_1 = require("universal-authenticator-library");
const UALMeetOneError_1 = require("./UALMeetOneError");
const meet_bridge_1 = __importDefault(require("meet-bridge"));
const mt = new meet_bridge_1.default();
class MeetOneUser extends universal_authenticator_library_1.User {
    constructor(chain, wallet) {
        super();
        this.keys = [];
        this.chainId = '';
        this.wallet = wallet;
        if (chain && chain.chainId) {
            this.chainId = chain.chainId;
        }
    }
    signTransaction(transaction, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const res = yield mt.invokeTransaction(Object.assign(Object.assign({}, transaction), { 
                    // @ts-ignore
                    options: config }));
                if (res.code === 0) {
                    return {
                        wasBroadcast: true,
                        transactionId: res.data.transaction_id,
                        transaction,
                    };
                }
                else {
                    throw new Error('No result returned');
                }
            }
            catch (e) {
                console.log(e);
                throw new UALMeetOneError_1.UALMeetOneError('Unable to sign the given transaction', universal_authenticator_library_1.UALErrorType.Signing, e);
            }
        });
    }
    signArbitrary(publicKey, data, 
    // tslint:disable-next-line:variable-name
    _helpText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const res = yield mt.invokeSignature({ whatfor: 'Universal Authenticator', data, publicKey, isArbitrary: true });
                if (res.code === 0) {
                    return res.data.signature;
                }
                else {
                    throw new Error('No result returned');
                }
            }
            catch (e) {
                throw new UALMeetOneError_1.UALMeetOneError('Unable to sign arbitrary string', universal_authenticator_library_1.UALErrorType.Signing, e);
            }
        });
    }
    verifyKeyOwnership(_) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('MeetOne does not currently support verifyKeyOwnership');
        });
    }
    getAccountName() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.wallet.name;
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chainId;
        });
    }
    getKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.keys.length === 0) {
                this.keys.push(this.wallet.address);
            }
            return this.keys;
        });
    }
}
exports.MeetOneUser = MeetOneUser;
