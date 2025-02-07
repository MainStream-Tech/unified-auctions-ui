<template>
    <div class="SplitLayoutContainer">
        <SplitLayout :step.sync="step">
            <template #step0>
                <div v-if="isExplanationsShown" class="h-1/2">
                    <LandingBlock @explanations="explanationsTrigger" />
                </div>
                <div class="mx-4 md:mx-0 MainTextContainer">
                    <MainText
                        ref="mainText"
                        :auctions="auctions"
                        :auctions-error="auctionsError"
                        :is-auctions-loading="isAuctionsLoading"
                        :selected-auction-id="selectedAuctionId"
                        :is-explanations-shown="isExplanationsShown"
                        @selectedAuctionId:update="$emit('selectedAuctionId:update', $event)"
                    />
                </div>
            </template>
            <template #step1>
                <div>
                    <Auction
                        v-if="selectedAuctionId"
                        :is-explanations-shown="isExplanationsShown"
                        class="mt-6 mb-8 mx-8"
                        :auction="selectedAuction"
                        :wallet-address="walletAddress"
                        :auction-id="selectedAuctionId"
                        :is-auctions-loading="isAuctionsLoading"
                        @restart="$emit('restart', $event)"
                        @swap="step = 2"
                    />
                </div>
            </template>
            <template #step2>
                <SwapTransaction
                    v-if="selectedAuction"
                    class="mt-6 mb-8 mx-8"
                    :auction-transaction="selectedAuction"
                    :is-connecting="isConnecting"
                    :is-authorizing="isAuthorizing"
                    :is-wallet-authorised="isWalletAuthorised"
                    :authorised-collaterals="authorisedCollaterals"
                    :is-executing="isExecuting"
                    :wallet-address="walletAddress"
                    :is-explanations-shown="isExplanationsShown"
                    @connect="$emit('connect')"
                    @disconnect="$emit('disconnect')"
                    @authorizeWallet="$emit('authorizeWallet')"
                    @authorizeCollateral="$emit('authorizeCollateral', $event)"
                    @execute="$emit('execute', $event)"
                />
            </template>
        </SplitLayout>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import SplitLayout from '~/components/layout/SplitLayout.vue';
import MainText from '~/components/MainText.vue';
import LandingBlock from '~/components/layout/LandingBlock.vue';
import Auction from '~/components/Auction.vue';
import SwapTransaction from '~/components/transaction/SwapTransaction.vue';

export default Vue.extend({
    components: { SplitLayout, MainText, Auction, SwapTransaction, LandingBlock },
    props: {
        auctions: {
            type: Array as Vue.PropType<AuctionTransaction[]>,
            default: () => [],
        },
        isAuctionsLoading: {
            type: Boolean,
            default: false,
        },
        auctionsError: {
            type: String,
            default: null,
        },
        selectedAuctionId: {
            type: String,
            default: null,
        },
        isConnecting: {
            type: Boolean,
            default: false,
        },
        isAuthorizing: {
            type: Boolean,
            default: false,
        },
        isExecuting: {
            type: Boolean,
            default: false,
        },
        isWalletAuthorised: {
            type: Boolean,
            default: false,
        },
        authorisedCollaterals: {
            type: Array as Vue.PropType<string[]>,
            default: () => [],
        },
        walletAddress: {
            type: String,
            default: null,
        },
        isExplanationsShown: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        step: 0,
    }),
    computed: {
        selectedAuction(): AuctionTransaction | null {
            return this.auctions.find(auctionTransaction => auctionTransaction.id === this.selectedAuctionId) || null;
        },
    },
    watch: {
        selectedAuctionId: {
            immediate: true,
            handler(newSelectedAuctionId) {
                if (!newSelectedAuctionId) {
                    this.step = 0;
                } else {
                    this.step = 1;
                }
            },
        },
        step: {
            immediate: true,
            handler(newStep) {
                if (newStep === 0) {
                    this.$emit('update:selectedAuctionId', null);
                }
            },
        },
    },
    methods: {
        explanationsTrigger(event: boolean): void {
            if (event === true && this.$refs.mainText) {
                (this.$refs.mainText as Vue).$el.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
            this.$emit('update:isExplanationsShown', event);
        },
    },
});
</script>

<style scoped>
.SplitLayoutContainer {
    height: calc(100vh - 4rem);
}
.MainTextContainer {
    min-height: calc(100vh - 10rem);
}
</style>
