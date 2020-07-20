import { Authenticator, ButtonStyle, Chain, UALError, User } from 'universal-authenticator-library';
export declare class MeetOne extends Authenticator {
    private users;
    private meetoneIsLoading;
    private initError;
    private readonly supportedChains;
    /**
     * MeetOne Constructor.
     * @param chains
     */
    constructor(chains: Chain[]);
    private supportsAllChains;
    /**
     * handle any async operations required to initialize the authenticator.
     * isLoading() should return true until all async operations in init are complete and the authenticator is ready to accept login/logout requests.
     */
    init(): Promise<void>;
    reset(): void;
    getStyle(): ButtonStyle;
    shouldRender(): boolean;
    shouldAutoLogin(): boolean;
    /**
     * Requests the currently active account from Meet.One, will throw a Login error if Meet.One
     * does not respond or errors out
     */
    login(): Promise<User[]>;
    /**
     * Clears the array of authenticated users
     * Note: The name - logout - is slightly misleading in this particular case
     * as calling this method will not log a user out of the Meet.One app but rather
     * refresh the user list on the authenticator
     */
    logout(): Promise<void>;
    shouldRequestAccountName(): Promise<boolean>;
    isLoading(): boolean;
    isErrored(): boolean;
    getError(): UALError | null;
    getOnboardingLink(): string;
    requiresGetKeyConfirmation(): boolean;
    isMeetOneWebview(): boolean;
    /**
     * Returns the amount of seconds after the authentication will be invalid for logging in on new
     * browser sessions.  Setting this value to zero will cause users to re-attempt authentication on
     * every new browser session.  Please note that the invalidate time will be saved client-side and
     * should not be relied on for security.
     */
    shouldInvalidateAfter(): number;
}
