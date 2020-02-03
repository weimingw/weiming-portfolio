class MainPageAccessor {
    constructor() {
        this.mainPageState = null;
        this.mainPageFunctions = null;
    }

    setInstance = (state, functions) => {
        this.mainPageState = state;
        this.mainPageFunctions = functions;
    };

    setHeader = (props) => {
        this.mainPageState.headerProps = props;
    }

    setSidebar = (props) => {
        this.mainPageState.sidebarProps = props;
    }

    setFooter = (props) => {
        this.mainPageState.footerProps = props;
    }

    setLoading = (isLoading) => {
        if (this.mainPageState) {
            this.mainPageState.loading = isLoading;
        }
    }

    closeSidebar = () => {
        if (this.mainPageFunctions) {
            this.mainPageFunctions.closeSidebar();
        }
    }
}

export default new MainPageAccessor();