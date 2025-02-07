<template>
    <Select
        v-if="walletAddress || isLoading"
        :options="[{ label: 'Disconnect', value: -1 }]"
        :title="walletAddress"
        @input="$emit('changeWalletType')"
    >
        <template #text-prefix>
            <icon type="wallet" class="pr-2 text-3xl md:text-sm" />
        </template>
        <template #title>
            <div v-if="isLoading" class="flex items-center">
                <span>Connecting...</span>
            </div>
            <FormatAddress v-else-if="walletAddress" :value="walletAddress" shorten disable />
        </template>
    </Select>
    <div v-else-if="!hasAcceptedTerms" class="flex items-center cursor-pointer" @click="$emit('openTermsModal')">
        <icon type="wallet" class="pr-2 text-3xl md:text-sm" />
        <span class="hidden lg:inline">Connect a Wallet</span>
    </div>
    <Select
        v-else
        title="Connect a Wallet"
        :options="wallets"
        :visible="isModalOpen"
        @update:visible="$emit('update:isModalOpen', $event)"
        @input="$emit('changeWalletType', $event)"
    >
        <template #text-prefix>
            <icon type="wallet" class="pr-2 text-3xl md:text-sm" />
        </template>
    </Select>
</template>

<script lang="ts">
import Vue from 'vue';
import { Icon } from 'ant-design-vue';
import Select from '~/components/common/Select.vue';
import { WALLETS } from '~/lib/wallet';
import FormatAddress from '~/components/utils/FormatAddress.vue';

export default Vue.extend({
    components: {
        Select,
        Icon,
        FormatAddress,
    },
    props: {
        walletAddress: {
            type: String,
            default: null,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        isModalOpen: {
            type: Boolean,
            default: false,
        },
        hasAcceptedTerms: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        wallets(): SelectOption[] {
            return WALLETS.map(Wallet => {
                return { label: Wallet.title, value: Wallet.title, icon: Wallet.icon };
            });
        },
    },
});
</script>
