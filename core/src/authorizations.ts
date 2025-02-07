import type { Notifier } from './types';
import getMaker from './maker';
import trackTransaction from './tracker';

export const authorizeWallet = async function (revoke: boolean, notifier?: Notifier): Promise<string> {
    const maker = await getMaker();
    const joinDaiAddress = maker.service('smartContract').getContract('MCD_JOIN_DAI').address;
    const vatContract = maker.service('smartContract').getContract('MCD_VAT');
    const transaction = revoke ? vatContract.nope(joinDaiAddress) : vatContract.hope(joinDaiAddress);
    return trackTransaction(transaction, notifier);
};

export const authorizeCollateral = async function (
    collateralType: string,
    revoke: boolean,
    notifier?: Notifier
): Promise<string> {
    const maker = await getMaker();
    const clipperAddress = maker.service('liquidation')._clipperContractByIlk(collateralType).address;
    const vatContract = maker.service('smartContract').getContract('MCD_VAT');
    const transaction = revoke ? vatContract.nope(clipperAddress) : vatContract.hope(clipperAddress);
    return trackTransaction(transaction, notifier);
};

export const getWalletAuthorizationStatus = async function (walletAddress: string): Promise<boolean> {
    const maker = await getMaker();
    const joinDaiAddress = maker.service('smartContract').getContract('MCD_JOIN_DAI').address;
    const authorizationStatus = await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .can(walletAddress, joinDaiAddress);
    return authorizationStatus.toNumber() === 1;
};

export const getCollateralAuthorizationStatus = async function (
    collateralType: string,
    walletAddress: string
): Promise<boolean> {
    const maker = await getMaker();
    const clipperAddress = maker.service('liquidation')._clipperContractByIlk(collateralType).address;
    const authorizationStatus = await maker
        .service('smartContract')
        .getContract('MCD_VAT')
        .can(walletAddress, clipperAddress);
    return authorizationStatus.toNumber() === 1;
};
