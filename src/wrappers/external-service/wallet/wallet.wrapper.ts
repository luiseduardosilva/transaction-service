import { Injectable } from '@nestjs/common';
import api from '../../../configs/axios.config';
import {
    ChangeWalletBalanceProps,
    GetWalletProps,
    IWalletWrapper,
} from './interfaces';

@Injectable()
export class WalletWrapper implements IWalletWrapper {
    async changeWalletBalance(
        props: ChangeWalletBalanceProps,
    ): Promise<boolean> {
        const { id, value } = props;
        const wallet = await this.request({
            url: `api/v1/wallets/${id}`,
            method: 'put',
            params: { value },
        });

        if (!wallet.request) {
            return false;
        }
        return true;
    }

    async getWallet(props: GetWalletProps): Promise<boolean> {
        const { id } = props;

        const wallet = await this.request({
            url: `api/v1/wallets/${id}`,
            method: 'get',
        });
        return wallet.request;
    }

    async request(props: {
        url: string;
        method: 'put' | 'post' | 'get';
        params?: any;
    }) {
        const { url, method, params } = props;
        try {
            const wallet = await api[method](url, params);
            return { request: true, data: wallet?.data, status: wallet.status };
        } catch (error) {
            return {
                request: false,
                data: error?.response?.data,
                status: error?.response?.status,
            };
        }
    }
}
