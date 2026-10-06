import {
    FiCalendar,
    FiEdit2,
    FiExternalLink,
    FiMapPin,
    FiPlus,
    FiSearch,
    FiTrash2,
} from "react-icons/fi";
import { applicationStatuses } from "../../data/applicationStatuses.js";
import styles from "./styles.module.css";

const formatDate = (date) =>
    date
        ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "Not set";

const getInitials = (company) =>
    company
        .split(/\s+/)
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

const ApplicationTable = ({
    applications,
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onStatusChange,
    onAdd,
    onEdit,
    onDelete,
    onClearFilters,
}) => (
    <section
        className={styles.applicationList}
        id="application-list"
        aria-labelledby="application-list-title"
    >
        <div className={styles.heading}>
            <div>
                <p className={styles.label}>Your search</p>
                <h2 id="application-list-title">Application log</h2>
                <p className={styles.description}>
                    {applications.length} {applications.length === 1 ? "role" : "roles"} to keep in view
                </p>
            </div>
            <button className={styles.addButton} type="button" onClick={onAdd}>
                <FiPlus aria-hidden="true" />
                Log an application
            </button>
        </div>

        <div className={styles.toolbar}>
            <label className={styles.searchField}>
                <FiSearch aria-hidden="true" />
                <span className={styles.screenReaderOnly}>Search roles and companies</span>
                <input
                    type="search"
                    value={search}
                    onChange={(changeEvent) => onSearchChange(changeEvent.target.value)}
                    placeholder="Search roles, companies, notes..."
                />
            </label>
            <label className={styles.filterField}>
                <span>Status</span>
                <select
                    value={statusFilter}
                    onChange={(changeEvent) => onStatusFilterChange(changeEvent.target.value)}
                >
                    <option value="all">All statuses</option>
                    {applicationStatuses.map((status) => (
                        <option key={status}>{status}</option>
                    ))}
                </select>
            </label>
        </div>

        {applications.length ? (
            <div className={styles.table} role="table" aria-label="Job applications">
                <div className={styles.tableHead} role="row">
                    <span role="columnheader">Company and role</span>
                    <span role="columnheader">Status</span>
                    <span role="columnheader">Applied</span>
                    <span role="columnheader">Next step</span>
                    <span className={styles.screenReaderOnly} role="columnheader">Actions</span>
                </div>
                <div className={styles.tableBody} role="rowgroup">
                    {applications.map((application) => (
                        <article className={styles.application} role="row" key={application.id}>
                            <div className={styles.companyCell} role="cell">
                                <span className={styles.companyMark} aria-hidden="true">
                                    {getInitials(application.company)}
                                </span>
                                <div className={styles.companyInfo}>
                                    <strong>{application.company}</strong>
                                    <span>{application.role}</span>
                                    <span className={styles.location}>
                                        <FiMapPin aria-hidden="true" />
                                        {application.location || application.workMode}
                                        {application.location && application.workMode
                                            ? " - " + application.workMode
                                            : ""}
                                    </span>
                                </div>
                                {application.url ? (
                                    <a
                                        className={styles.jobLink}
                                        href={application.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={"Open job link for " + application.role + " at " + application.company}
                                    >
                                        <FiExternalLink aria-hidden="true" />
                                    </a>
                                ) : null}
                            </div>

                            <div className={styles.statusCell} role="cell">
                                <span className={styles.cellLabel}>Status</span>
                                <select
                                    className={styles.statusSelect}
                                    value={application.status}
                                    onChange={(changeEvent) =>
                                        onStatusChange(application.id, changeEvent.target.value)
                                    }
                                    aria-label={"Status for " + application.role + " at " + application.company}
                                >
                                    {applicationStatuses.map((status) => (
                                        <option key={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.dateCell} role="cell">
                                <span className={styles.cellLabel}>Applied</span>
                                <span className={styles.date}>
                                    <FiCalendar aria-hidden="true" />
                                    {formatDate(application.dateApplied)}
                                </span>
                            </div>

                            <div className={styles.nextStepCell} role="cell">
                                <span className={styles.cellLabel}>Next step</span>
                                <strong>{application.nextStep || "Add a next step"}</strong>
                                <span>{application.nextDate ? formatDate(application.nextDate) : "No date set"}</span>
                            </div>

                            <div className={styles.actions} role="cell">
                                <button
                                    type="button"
                                    aria-label={"Edit " + application.role + " at " + application.company}
                                    title="Edit application"
                                    onClick={() => onEdit(application)}
                                >
                                    <FiEdit2 aria-hidden="true" />
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    type="button"
                                    aria-label={"Remove " + application.role + " at " + application.company}
                                    title="Remove application"
                                    onClick={() => onDelete(application)}
                                >
                                    <FiTrash2 aria-hidden="true" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        ) : (
            <div className={styles.empty}>
                <h3>No applications found</h3>
                <p>Try another search or status, or clear the filters.</p>
                <button type="button" onClick={onClearFilters}>Clear filters</button>
            </div>
        )}
    </section>
);

export { ApplicationTable };
