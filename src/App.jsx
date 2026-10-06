import { CareerOverview } from "./components/careerOverview/index.jsx";
import { SiteHeader } from "./components/siteHeader/index.jsx";
import { sampleApplications } from "./data/sampleApplications.js";
import { BackToTop } from "./components/backToTop/index.jsx";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.appShell} id="top">
        <SiteHeader />
        <main className={styles.pageContent}>
            <CareerOverview applications={sampleApplications} />
            <section className={styles.followUps} id="follow-ups">
                <h2>Follow-ups</h2>
            </section>
        </main>
        <BackToTop />
    </div>
);

export default App;
