import type { Auction } from 'auctions-core/src/types';
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import AuctionComponent from './Auction.vue';
import { generateFakeAuction } from '~/helpers/generateFakeAuction';

const fakeAuction = generateFakeAuction();
const basicStory = {
    components: {
        Auction: AuctionComponent,
    },
    computed: {
        auctionParams(): Auction {
            return {
                ...fakeAuction,
            };
        },
    },
    data() {
        return {
            fakeAuction,
        };
    },
    methods: {
        swap: action('swap'),
    },
};

storiesOf('Auction', module)
    .add('Default', () => ({
        ...basicStory,
        template: `<Auction :auction="auctionParams" auctionId="test" @swap="swap"/>`,
    }))
    .add('Max Width', () => ({
        ...basicStory,
        template: `
        <div class="flex items-center w-3/5">
            <Auction :auction="auctionParams" auctionId="test" @swap="swap"/>
        </div>`,
    }))
    .add('Finished', () => ({
        ...basicStory,
        template: `
        <div class="flex items-center w-3/5">
            <Auction :auction="auctionParams" auctionId="test" error="This auction is finished"/>
        </div>`,
    }));
