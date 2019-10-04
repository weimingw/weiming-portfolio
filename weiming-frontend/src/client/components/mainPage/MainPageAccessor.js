class MainPageAccessor {
    constructor() {
        this.mainPageInstance = null;
    }

    setInstance(instance) {
        this.mainPageInstance = instance;
    }

    setHeader(props) {
        this.mainPageInstance.headerProps = props;
    }

    setSidebar(props) {
        this.mainPageInstance.sidebarProps = props;
    }

    setFooter(props) {
        this.mainPageInstance.footerProps = props;
    }
}

export default new MainPageAccessor();