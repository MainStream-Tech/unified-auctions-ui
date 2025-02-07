import { ActionContext } from 'vuex';
import type { CollateralRow } from 'auctions-core/src/types';
import COLLATERALS from 'auctions-core/src/constants/COLLATERALS';
import { getExchangeRateBySymbol } from 'auctions-core/src/uniswap';
import { fetchCalcParametersByCollateralType } from 'auctions-core/src/params';
import Vue from 'vue';

interface State {
    collaterals: CollateralRow[];
}

export const state = (): State => ({
    collaterals: [],
});

export const getters = {
    collaterals(state: State) {
        return state.collaterals || [];
    },
};

export const mutations = {
    setCollaterals(state: State, collaterals: CollateralRow[]) {
        state.collaterals = [...collaterals];
    },
    updateCollateral(state: State, updatedCollateral: CollateralRow) {
        const collateralIndex = state.collaterals.findIndex(collateral => collateral.ilk === updatedCollateral.ilk);
        Vue.set(state.collaterals, collateralIndex, {
            ...state.collaterals[collateralIndex],
            ...updatedCollateral,
        });
    },
};

export const actions = {
    async fetchStepAndCut({ commit, dispatch, rootGetters }: ActionContext<State, State>) {
        const network = rootGetters['network/getMakerNetwork'];
        if (!network) {
            return;
        }
        dispatch('setup');
        for (const collateral of Object.values(COLLATERALS)) {
            const marketUnitPrice = await getExchangeRateBySymbol(network, collateral.symbol).catch(error => {
                console.error(error);
                return error.toString();
            });
            const calcParameters = await fetchCalcParametersByCollateralType(network, collateral.ilk).catch(error => {
                console.error(error);
                return {
                    secondsBetweenPriceDrops: error.toString(),
                    priceDropRatio: error.toString(),
                };
            });
            const updated = {
                ilk: collateral.ilk,
                marketUnitPrice,
                secondsBetweenPriceDrops: calcParameters.secondsBetweenPriceDrops,
                priceDropRatio: calcParameters.priceDropRatio,
            };
            commit('updateCollateral', updated);
        }
    },
    setup({ commit }: ActionContext<State, State>) {
        const collaterals = Object.values(COLLATERALS).map(collateral => ({
            ilk: collateral.ilk,
            symbol: collateral.symbol,
        }));
        commit('setCollaterals', collaterals);
    },
};
