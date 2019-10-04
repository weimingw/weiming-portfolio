import mainPageAccessor from '../components/mainPage/MainPageAccessor';

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
        mainPageAccessor.setHeader({ });
        mainPageAccessor.setFooter({ });
    }
}