import { FiArrowUpRight, FiCalendar, FiClock } from "react-icons/fi";
import styles from "./styles.module.css";

const getDaysUntil = (date) => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const nextDate = new Date(date + "T12:00:00");

    return Math.round((nextDate - today) / (1000 * 60 * 60 * 24));
};

const getMonth = (date) =>
    new Date(date + "T12:00:00")
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase();

const getDueLabel = (days) => {
    if (days < 0) return "Past due";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    return "In " + days + " days";
};

const FollowUpPanel = ({ applications, onEdit }) => {
    const nextSteps = applications
        .filter(
            (application) =>
                application.nextDate && application.status !== "Closed",
        )
        .sort((first, second) =>
            first.nextDate.localeCompare(second.nextDate),
        )
        .slice(0, 5);

    return (
        <aside
            className={styles.panel}
            id="follow-ups"
            aria-labelledby="follow-up-title"
        >
            <div className={styles.heading}>
                <span className={styles.icon}>
                    <FiCalendar aria-hidden="true" />
                </span>
                <div>
                    <p>This week</p>
                    <h2 id="follow-up-title">Next steps</h2>
                </div>
            </div>

            {nextSteps.length ? (
                <ol className={styles.list}>
                    {nextSteps.map((application) => {
                        const daysUntil = getDaysUntil(application.nextDate);

                        return (
                            <li className={styles.item} key={application.id}>
                                <div className={styles.dateBlock}>
                                    <span>{getMonth(application.nextDate)}</span>
                                    <strong>
                                        {new Date(
                                            application.nextDate + "T12:00:00",
                                        ).getDate()}
                                    </strong>
                                </div>
                                <div className={styles.itemDetails}>
                                    <span className={styles.company}>
                                        {application.company}
                                    </span>
                                    <strong>{application.nextStep}</strong>
                                    <span className={styles.role}>
                                        {application.role}
                                    </span>
                                </div>
                                <div className={styles.itemSide}>
                                    <span
                                        className={
                                            daysUntil < 0
                                                ? styles.overdue
                                                : styles.due
                                        }
                                    >
                                        <FiClock aria-hidden="true" />
                                        {getDueLabel(daysUntil)}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label={
                                            "Edit next step for " +
                                            application.role +
                                            " at " +
                                            application.company
                                        }
                                        title="Edit application"
                                        onClick={() => onEdit(application)}
                                    >
                                        <FiArrowUpRight aria-hidden="true" />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <div className={styles.empty}>
                    <h3>Nothing to chase today</h3>
                    <p>Add a next step to an active application and it will appear here.</p>
                    <a href="#application-list">View applications</a>
                </div>
            )}
        </aside>
    );
};

export { FollowUpPanel };

