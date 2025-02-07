<template>
    <header class="bg-primary dark:bg-primary-dark">
        <nav class="flex items-center py-2 px-4 md:px-10">
            <nuxt-link
                :to="isUnifiedPage ? '/' : '/collateral'"
                class="flex items-center text-gray-700 hover:text-gray-600 no-underline"
            >
                <branding-icon class="h-12 w-12" />
                <span v-if="isUnifiedPage" class="ml-2 mb-0 hidden md:block"> Unified Auctions </span>
                <span v-else class="ml-2 mb-0 hidden md:block"> Collateral auctions </span>
            </nuxt-link>

            <div class="flex-1 flex justify-end space-x-4 items-center">
                <label class="flex items-center space-x-2 cursor-pointer select-none pt-1 md:pt-0">
                    <BaseSwitch
                        :is-checked="isExplanationsShown"
                        class="mt-px"
                        @update:isChecked="$emit('update:isExplanationsShown', $event)"
                    />
                    <span class="text-gray-700">Explanations</span>
                </label>

                <div class="flex space-x-4">
                    <NetworkSelector
                        v-if="!isUnifiedPage"
                        :network="network"
                        @update:network="$emit('update:network', $event)"
                    />

                    <WalletSelector
                        v-if="!(isUnifiedPage || network === 'stub')"
                        class="hidden sm:block"
                        :wallet-address="walletAddress"
                        :is-loading="isWalletLoading"
                        :is-modal-open="isWalletModalOpen"
                        :has-accepted-terms="hasAcceptedTerms"
                        @update:isModalOpen="$emit('update:isModalOpen', $event)"
                        @changeWalletType="$emit('changeWalletType', $event)"
                        @openTermsModal="$emit('openTermsModal')"
                    />

                    <ThemeSwitcher :dark-mode="darkMode" @update="$emit('update:darkMode', $event)" />
                </div>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
import Vue from 'vue';
import BrandingIcon from '~/assets/icons/logo.svg';
import BaseSwitch from '~/components/common/BaseSwitch.vue';

import NetworkSelector from '~/components/utils/NetworkSelector.vue';
import WalletSelector from '~/components/utils/WalletSelector.vue';
import ThemeSwitcher from '~/components/utils/ThemeSwitcher.vue';

export default Vue.extend({
    name: 'Header',
    components: {
        ThemeSwitcher,
        BrandingIcon,
        BaseSwitch,
        NetworkSelector,
        WalletSelector,
    },
    props: {
        type: {
            type: String,
            default: 'default',
            validator: type => ['default', 'unified'].includes(type),
        },
        isExplanationsShown: {
            type: Boolean,
            required: true,
        },
        network: {
            type: String,
            default: null,
        },
        darkMode: {
            type: Boolean,
            default: false,
        },
        walletAddress: {
            type: String,
            default: null,
        },
        isWalletLoading: {
            type: Boolean,
            default: false,
        },
        isWalletModalOpen: {
            type: Boolean,
            default: false,
        },
        hasAcceptedTerms: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        isUnifiedPage() {
            return this.type === 'unified';
        },
    },
});
</script>
