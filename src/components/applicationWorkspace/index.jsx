import { useState } from "react";
import { FiHardDrive } from "react-icons/fi";
import { ApplicationModal } from "../applicationModal/index.jsx";
import { ApplicationTable } from "../applicationTable/index.jsx";
import { ConfirmationModal } from "../confirmationModal/index.jsx";
import { CareerOverview } from "../careerOverview/index.jsx";
import { FollowUpPanel } from "../followUpPanel/index.jsx";
import { applicationStatuses, workModes } from "../../data/applicationStatuses.js";
import { sampleApplications } from "../../data/sampleApplications.js";
import styles from "./styles.module.css";

const storageKey = "rolebook-applications-v1";

const isDateValue = (value) => {
    if (value === "") return true;
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T12:00:00`);
    return !Number.isNaN(date.getTime())
        && date.getFullYear() === Number(value.slice(0, 4))
        && date.getMonth() + 1 === Number(value.slice(5, 7))
        && date.getDate() === Number(value.slice(8, 10));
};

const isApplicationRecord = (application) => {
    if (!application || typeof application !== "object") return false;

    const requiredTextFields = ["company", "role"];
    const optionalTextFields = [
        "location", "nextStep", "salary", "contactName", "contactEmail", "url", "notes",
    ];

    return typeof application.id === "string"
        && application.id.length > 0
        && requiredTextFields.every((field) => typeof application[field] === "string")
        && optionalTextFields.every((field) =>
            application[field] === undefined || typeof application[field] === "string",
        )
        && applicationStatuses.includes(application.status)
        && workModes.includes(application.workMode)
        && isDateValue(application.dateApplied ?? "")
        && isDateValue(application.nextDate ?? "");
};

const readApplications = () => {
    let savedApplications;
    try {
        savedApplications = window.localStorage.getItem(storageKey);
    } catch {
        return {
            applications: sampleApplications,
            notice: "Browser storage is unavailable. Changes will not stay after this page closes.",
        };
    }

    if (!savedApplications) return { applications: sampleApplications, notice: null };

    try {
        const parsedApplications = JSON.parse(savedApplications);
        if (!Array.isArray(parsedApplications)) {
            return {
                applications: sampleApplications,
                notice: "Saved application data could not be read. Example records are shown.",
            };
        }

        const validApplications = parsedApplications
            .filter(isApplicationRecord)
            .map((application) => ({
                ...application,
                location: application.location ?? "",
                dateApplied: application.dateApplied ?? "",
                nextStep: application.nextStep ?? "",
                nextDate: application.nextDate ?? "",
                salary: application.salary ?? "",
                contactName: application.contactName ?? "",
                contactEmail: application.contactEmail ?? "",
                url: application.url ?? "",
                notes: application.notes ?? "",
            }));
        return {
            applications: validApplications,
            notice: validApplications.length === parsedApplications.length
                ? null
                : "Some saved application records were invalid and have been skipped.",
        };
    } catch {
        return {
            applications: sampleApplications,
            notice: "Saved application data could not be read. Example records are shown.",
        };
    }
};

const ApplicationWorkspace = () => {
    const [initialRead] = useState(readApplications);
    const [applications, setApplications] = useState(initialRead.applications);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [applicationToEdit, setApplicationToEdit] = useState(null);
    const [applicationToRemove, setApplicationToRemove] = useState(null);
    const [storageNotice, setStorageNotice] = useState(initialRead.notice);

    const saveApplications = (updatedApplications) => {
        setApplications(updatedApplications);

        try {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify(updatedApplications),
            );
            setStorageNotice(null);
        } catch {
            setStorageNotice(
                "Browser storage is unavailable. Changes will not stay after this page closes.",
            );
        }
    };

    const normalizedSearch = search.trim().toLowerCase();
    const visibleApplications = applications
        .filter((application) => {
            const matchesStatus =
                statusFilter === "all" || application.status === statusFilter;
            const searchableDetails = [
                application.company,
                application.role,
                application.location,
                application.status,
                application.nextStep,
                application.contactName,
                application.notes,
            ]
                .join(" ")
                .toLowerCase();
            const matchesSearch = searchableDetails.includes(normalizedSearch);

            return matchesStatus && matchesSearch;
        })
        .sort((first, second) =>
            (second.dateApplied || "").localeCompare(first.dateApplied || ""),
        );

    const openNewApplication = () => {
        setApplicationToEdit(null);
        setModalOpen(true);
    };

    const openEditApplication = (application) => {
        setApplicationToEdit(application);
        setModalOpen(true);
    };

    const closeApplicationModal = () => {
        setModalOpen(false);
        setApplicationToEdit(null);
    };

    const saveApplication = (applicationDetails) => {
        const updatedApplications = applicationDetails.id
            ? applications.map((application) =>
                  application.id === applicationDetails.id
                      ? applicationDetails
                      : application,
              )
            : [
                  { ...applicationDetails, id: Date.now().toString() },
                  ...applications,
              ];

        saveApplications(updatedApplications);
        closeApplicationModal();
    };

    const updateStatus = (applicationId, status) => {
        const updatedApplications = applications.map((application) =>
            application.id === applicationId
                ? { ...application, status }
                : application,
        );

        saveApplications(updatedApplications);
    };

    const removeApplication = () => {
        const updatedApplications = applications.filter(
            (application) => application.id !== applicationToRemove.id,
        );

        saveApplications(updatedApplications);
        setApplicationToRemove(null);
    };

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };

    return (
        <div className={styles.workspace}>
            <CareerOverview applications={applications} />
            <div className={styles.dashboardLayout}>
                <div className={styles.mainColumn}>
                    <ApplicationTable
                        applications={visibleApplications}
                        search={search}
                        onSearchChange={setSearch}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        onStatusChange={updateStatus}
                        onAdd={openNewApplication}
                        onEdit={openEditApplication}
                        onDelete={setApplicationToRemove}
                        onClearFilters={clearFilters}
                    />
                    <p className={styles.storageNote}>
                        <FiHardDrive aria-hidden="true" />
                        {storageNotice || "Your list is saved in this browser on this device."}
                    </p>
                </div>
                <div className={styles.sideColumn}>
                    <FollowUpPanel
                        applications={applications}
                        onEdit={openEditApplication}
                    />
                    <aside className={styles.noteCard}>
                        <span>Keep the context</span>
                        <p>
                            Write down what clicked in each conversation and
                            what you want to ask next.
                        </p>
                    </aside>
                </div>
            </div>

            {modalOpen ? (
                <ApplicationModal
                    key={applicationToEdit?.id ?? "new-application"}
                    application={applicationToEdit}
                    onClose={closeApplicationModal}
                    onSave={saveApplication}
                />
            ) : null}

            {applicationToRemove ? (
                <ConfirmationModal
                    title="Remove this application?"
                    description={
                        applicationToRemove.role +
                        " at " +
                        applicationToRemove.company +
                        " will be removed from your list in this browser."
                    }
                    confirmLabel="Remove application"
                    onCancel={() => setApplicationToRemove(null)}
                    onConfirm={removeApplication}
                />
            ) : null}
        </div>
    );
};

export { ApplicationWorkspace };
