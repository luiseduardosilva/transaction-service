export type GetWalletProps = {
    id: number;
};

export type ChangeWalletBalanceProps = {
    id: number;
    value: number;
};

export interface IWalletWrapper {
    changeWalletBalance(props: ChangeWalletBalanceProps): Promise<boolean>;
    getWallet(props: GetWalletProps): Promise<boolean>;
}
export const IWalletWrapper = Symbol('IWalletWrapper');
