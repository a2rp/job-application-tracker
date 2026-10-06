import { useState } from "react";
import { FiHardDrive } from "react-icons/fi";
import { ApplicationModal } from "../applicationModal/index.jsx";
import { ApplicationTable } from "../applicationTable/index.jsx";
import { ConfirmationModal } from "../confirmationModal/index.jsx";
import { CareerOverview } from "../careerOverview/index.jsx";
import { FollowUpPanel } from "../followUpPanel/index.jsx";
import { sampleApplications } from "../../data/sampleApplications.js";
import styles from "./styles.module.css";

const storageKey = "rolebook-applications-v1";

const readApplications = () => {
    try {
        const savedApplications = window.localStorage.getItem(storageKey);
        if (!savedApplications) return sampleApplications;

        const parsedApplications = JSON.parse(savedApplications);
        return Array.isArray(parsedApplications)
            ? parsedApplications
            : sampleApplications;
    } catch {
        return sampleApplications;
    }
};

const ApplicationWorkspace = () => {
    const [applications, setApplications] = useState(readApplications);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [applicationToEdit, setApplicationToEdit] = useState(null);
    const [applicationToRemove, setApplicationToRemove] = useState(null);
    const [storageError, setStorageError] = useState(false);

    const saveApplications = (updatedApplications) => {
        setApplications(updatedApplications);

        try {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify(updatedApplications),
            );
            setStorageError(false);
        } catch {
            setStorageError(true);
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
                        {storageError
                            ? "Browser storage is unavailable. Changes will not stay after this page closes."
                            : "Your list is saved in this browser on this device."}
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
