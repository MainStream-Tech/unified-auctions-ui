import { storiesOf } from '@storybook/vue';
import faker from 'faker';
import FormatAddress from '~/components/utils/FormatAddress';

const common = {
    components: { FormatAddress },
    data() {
        return {
            walletAddress: faker.finance.ethereumAddress(),
        };
    },
};

storiesOf('Utils/FormatAddress', module)
    .add('Default', () => ({
        ...common,
        template: '<FormatAddress :value="walletAddress" />',
    }))
    .add('Shorten', () => ({
        ...common,
        template: '<FormatAddress shorten :value="walletAddress" />',
    }))
    .add('No Link', () => ({
        ...common,
        template: '<FormatAddress disable :value="walletAddress" />',
    }))
    .add('Explicit', () => ({
        ...common,
        template: '<FormatAddress explicit :value="walletAddress" />',
    }));
