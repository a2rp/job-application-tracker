import {
    FiArrowRight,
    FiBriefcase,
    FiCalendar,
    FiMessageCircle,
    FiTrendingUp,
} from "react-icons/fi";
import styles from "./styles.module.css";

const getDateKey = (date) =>
    [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");

const CareerOverview = ({ applications }) => {
    const today = new Date();
    const todayKey = getDateKey(today);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekKey = getDateKey(nextWeek);

    const activeRoles = applications.filter(
        (application) => application.status !== "Closed",
    ).length;
    const interviews = applications.filter((application) =>
        ["Screening", "Interview"].includes(application.status),
    ).length;
    const followUps = applications.filter(
        (application) =>
            application.nextDate &&
            application.nextDate <= nextWeekKey &&
            application.nextDate >= todayKey &&
            application.status !== "Closed",
    ).length;
    const offers = applications.filter(
        (application) => application.status === "Offer",
    ).length;

    const metrics = [
        {
            label: "Active roles",
            value: activeRoles,
            note: "in your search",
            icon: FiBriefcase,
        },
        {
            label: "Interviews",
            value: interviews,
            note: "in progress",
            icon: FiMessageCircle,
        },
        {
            label: "Follow-ups",
            value: followUps,
            note: "due this week",
            icon: FiCalendar,
        },
        {
            label: "Offers",
            value: offers,
            note: "to review",
            icon: FiTrendingUp,
        },
    ];

    return (
        <section
            className={styles.overview}
            id="applications"
            aria-labelledby="overview-title"
        >
            <div className={styles.welcome}>
                <div className={styles.welcomeCopy}>
                    <p className={styles.label}>Your job search</p>
                    <h1 id="overview-title">
                        Make the <span>next move.</span>
                    </h1>
                    <p className={styles.intro}>
                        Keep every application, conversation, and next step
                        together.
                    </p>
                    <a className={styles.actionLink} href="#follow-ups">
                        <span>See this week</span>
                        <FiArrowRight aria-hidden="true" />
                    </a>
                </div>
                <div className={styles.photo}>
                    <img
                        src={
                            import.meta.env.BASE_URL +
                            "images/career-workspace.jpg"
                        }
                        alt="Laptop, coffee, and notebook ready for a work session"
                    />
                    <div className={styles.photoNote}>
                        <span>Stay in motion</span>
                        <p>One thoughtful follow-up can open the next door.</p>
                    </div>
                </div>
            </div>
            <div className={styles.metrics}>
                {metrics.map(({ label, value, note, icon: Icon }) => (
                    <article className={styles.metric} key={label}>
                        <span className={styles.metricIcon}>
                            <Icon aria-hidden="true" />
                        </span>
                        <div>
                            <p>{label}</p>
                            <strong>{value}</strong>
                            <span>{note}</span>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export { CareerOverview };
