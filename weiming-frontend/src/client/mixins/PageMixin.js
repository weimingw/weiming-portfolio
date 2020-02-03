import mainPageAccessor from '../components/mainPage/MainPageAccessor';
import { onBeforeUnmount } from '@vue/composition-api';

export default {
    mounted() {
        mainPageAccessor.setHeader(this.getHeaderProps())
        mainPageAccessor.setFooter(this.getFooterProps())
    },
    methods: {
        getHeaderProps() { },
        getFooterProps() { },
    },
    destroyed() {
        
    }
}

export function usePageConfiguration({ headerProps, footerProps }) {
    mainPageAccessor.setHeader(headerProps || { });
    mainPageAccessor.setFooter(footerProps || { });

    onBeforeUnmount(() => {
        mainPageAccessor.setHeader({ });
        mainPageAccessor.setFooter({ });
    });
}