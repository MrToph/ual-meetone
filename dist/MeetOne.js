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
exports.MeetOne = void 0;
const universal_authenticator_library_1 = require("universal-authenticator-library");
const interfaces_1 = require("./interfaces");
const MeetOneLogo_1 = require("./MeetOneLogo");
const MeetOneUser_1 = require("./MeetOneUser");
const UALMeetOneError_1 = require("./UALMeetOneError");
const meet_bridge_1 = __importDefault(require("meet-bridge"));
const mt = new meet_bridge_1.default();
class MeetOne extends universal_authenticator_library_1.Authenticator {
    /**
     * MeetOne Constructor.
     * @param chains
     */
    constructor(chains) {
        super(chains);
        this.users = [];
        this.meetoneIsLoading = true;
        this.initError = null;
        this.supportedChains = {
            // MEET.ONE wallet only supports EOS mainnet for now.
            aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906: {},
        };
    }
    supportsAllChains() {
        if (this.chains.length < 1) {
            return false;
        }
        for (const chain of this.chains) {
            if (!this.supportedChains.hasOwnProperty(chain.chainId)) {
                return false;
            }
        }
        return true;
    }
    /**
     * handle any async operations required to initialize the authenticator.
     * isLoading() should return true until all async operations in init are complete and the authenticator is ready to accept login/logout requests.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.meetoneIsLoading = true;
            try {
                // @ts-ignore
                if (window.scatter && !window.scatter.isInject) {
                    throw new Error('Unable to connect');
                }
            }
            catch (e) {
                this.initError = new UALMeetOneError_1.UALMeetOneError('Error occurred during autologin', universal_authenticator_library_1.UALErrorType.Initialization, e);
            }
            finally {
                this.meetoneIsLoading = false;
            }
        });
    }
    reset() {
        this.initError = null;
        this.init();
    }
    // Gives you the ability to customize your Authenticator and how it is displayed to app users.
    getStyle() {
        return {
            // An icon displayed to app users when selecting their authentication method
            icon: MeetOneLogo_1.MeetOneLogo,
            // Name displayed to app users
            text: interfaces_1.Name,
            // Color of text used on top the `backgound` property above
            textColor: '#FFFFFF',
            // Background color displayed to app users who select your authenticator
            background: '#4A4A4A'
        };
    }
    shouldRender() {
        // @ts-ignore
        if (this.supportsAllChains() && this.isMeetOneWebview()) {
            return true;
        }
        return false;
    }
    shouldAutoLogin() {
        // Always autologin if should render, since that should only be inside the meetone browser
        return this.shouldRender();
    }
    /**
     * Requests the currently active account from Meet.One, will throw a Login error if Meet.One
     * does not respond or errors out
     */
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.users.length === 0) {
                try {
                    const res = yield mt.invokeAccountInfo();
                    if (res.data) {
                        this.users.push(new MeetOneUser_1.MeetOneUser(this.chains[0], {
                            name: res.data.account,
                            address: res.data.publicKey
                        }));
                    }
                    else {
                        throw new Error('No result returned');
                    }
                }
                catch (e) {
                    throw new UALMeetOneError_1.UALMeetOneError('Unable to get the current account during login', universal_authenticator_library_1.UALErrorType.Login, e);
                }
            }
            return this.users;
        });
    }
    /**
     * Clears the array of authenticated users
     * Note: The name - logout - is slightly misleading in this particular case
     * as calling this method will not log a user out of the Meet.One app but rather
     * refresh the user list on the authenticator
     */
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.users = [];
        });
    }
    shouldRequestAccountName() {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
    isLoading() {
        return this.meetoneIsLoading;
    }
    isErrored() {
        return !!this.initError;
    }
    getError() {
        return this.initError;
    }
    getOnboardingLink() {
        return 'https://meet.one/';
    }
    requiresGetKeyConfirmation() {
        return false;
    }
    isMeetOneWebview() {
        const userAgent = window.navigator.userAgent;
        return userAgent.toLowerCase().includes('meet.one');
    }
    /**
     * Returns the amount of seconds after the authentication will be invalid for logging in on new
     * browser sessions.  Setting this value to zero will cause users to re-attempt authentication on
     * every new browser session.  Please note that the invalidate time will be saved client-side and
     * should not be relied on for security.
     */
    shouldInvalidateAfter() {
        return 86400;
    }
}
exports.MeetOne = MeetOne;
