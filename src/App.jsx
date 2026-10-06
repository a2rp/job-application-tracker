import { ApplicationWorkspace } from "./components/applicationWorkspace/index.jsx";
import { BackToTop } from "./components/backToTop/index.jsx";
import { SiteFooter } from "./components/siteFooter/index.jsx";
import { SiteHeader } from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.appShell} id="top">
        <SiteHeader />
        <main className={styles.pageContent}>
            <ApplicationWorkspace />
        </main>
        <SiteFooter />
        <BackToTop />
    </div>
);

export default App;
