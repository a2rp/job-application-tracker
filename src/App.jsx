import { SiteHeader } from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => (
    <div className={styles.appShell} id="top">
        <SiteHeader />
        <main className={styles.pageContent}>
            <section className={styles.placeholder} id="applications">
                <h1>Keep your next move in view.</h1>
                <p>Your applications will be easy to find and follow here.</p>
            </section>
            <section className={styles.followUps} id="follow-ups">
                <h2>Follow-ups</h2>
            </section>
        </main>
    </div>
);

export default App;
