import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import {
    applicationStatuses,
    workModes,
} from "../../data/applicationStatuses.js";
import styles from "./styles.module.css";

const getToday = () => {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
};

const ApplicationModal = ({ application, onClose, onSave }) => {
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const [form, setForm] = useState(() => ({
        company: application?.company ?? "",
        role: application?.role ?? "",
        location: application?.location ?? "",
        workMode: application?.workMode ?? "Remote",
        status: application?.status ?? "Applied",
        dateApplied: application?.dateApplied ?? getToday(),
        nextStep: application?.nextStep ?? "",
        nextDate: application?.nextDate ?? "",
        salary: application?.salary ?? "",
        contactName: application?.contactName ?? "",
        contactEmail: application?.contactEmail ?? "",
        url: application?.url ?? "",
        notes: application?.notes ?? "",
    }));

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return undefined;
        const previousFocus = document.activeElement;
        const getFocusable = () => Array.from(dialog.querySelectorAll(
            "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
        ));
        (getFocusable()[0] || dialog).focus();

        const handleKeys = (keyEvent) => {
            if (keyEvent.key === "Escape") {
                keyEvent.preventDefault();
                onCloseRef.current();
                return;
            }
            if (keyEvent.key !== "Tab") return;

            const focusable = getFocusable();
            if (!focusable.length) {
                keyEvent.preventDefault();
                dialog.focus();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (!dialog.contains(document.activeElement)) {
                keyEvent.preventDefault();
                (keyEvent.shiftKey ? last : first).focus();
            } else if (keyEvent.shiftKey && document.activeElement === first) {
                keyEvent.preventDefault();
                last.focus();
            } else if (!keyEvent.shiftKey && document.activeElement === last) {
                keyEvent.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeys);
        return () => {
            document.removeEventListener("keydown", handleKeys);
            const returnFocus = previousFocus instanceof HTMLElement && previousFocus.isConnected
                ? previousFocus
                : document.getElementById("main-content");
            returnFocus?.focus();
        };
    }, []);

    const updateField = (changeEvent) => {
        const { name, value } = changeEvent.target;
        setForm({ ...form, [name]: value });
    };

    const submitApplication = (submitEvent) => {
        submitEvent.preventDefault();
        onSave({
            ...form,
            id: application?.id,
            company: form.company.trim(),
            role: form.role.trim(),
            location: form.location.trim(),
            nextStep: form.nextStep.trim(),
            salary: form.salary.trim(),
            contactName: form.contactName.trim(),
            contactEmail: form.contactEmail.trim(),
            url: form.url.trim(),
            notes: form.notes.trim(),
        });
    };

    return (
        <div
            className={styles.overlay}
            role="presentation"
            onMouseDown={(mouseEvent) => {
                if (mouseEvent.target === mouseEvent.currentTarget) onClose();
            }}
        >
            <section
                ref={dialogRef}
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="application-modal-title"
                aria-describedby="application-modal-description"
                tabIndex={-1}
            >
                <header className={styles.modalHeader}>
                    <div>
                        <p className={styles.label}>Your job search</p>
                        <h2 id="application-modal-title">
                            {application
                                ? "Edit application"
                                : "Add an application"}
                        </h2>
                        <p id="application-modal-description">Save the details you will want to find later.</p>
                    </div>
                    <button
                        className={styles.closeButton}
                        type="button"
                        aria-label="Close application form"
                        onClick={onClose}
                    >
                        <FiX aria-hidden="true" />
                    </button>
                </header>
                <form className={styles.form} onSubmit={submitApplication}>
                    <div className={styles.fieldsTwo}>
                        <label className={styles.field}>
                            Company
                            <input
                                autoFocus
                                name="company"
                                required
                                maxLength="80"
                                value={form.company}
                                onChange={updateField}
                                placeholder="Morrow Studio"
                            />
                        </label>
                        <label className={styles.field}>
                            Role title
                            <input
                                name="role"
                                required
                                maxLength="100"
                                value={form.role}
                                onChange={updateField}
                                placeholder="Product Designer"
                            />
                        </label>
                    </div>
                    <div className={styles.fieldsThree}>
                        <label className={styles.field}>
                            Status
                            <select
                                name="status"
                                value={form.status}
                                onChange={updateField}
                            >
                                {applicationStatuses.map((status) => (
                                    <option key={status}>{status}</option>
                                ))}
                            </select>
                        </label>
                        <label className={styles.field}>
                            Work mode
                            <select
                                name="workMode"
                                value={form.workMode}
                                onChange={updateField}
                            >
                                {workModes.map((workMode) => (
                                    <option key={workMode}>{workMode}</option>
                                ))}
                            </select>
                        </label>
                        <label className={styles.field}>
                            Date applied
                            <input
                                name="dateApplied"
                                type="date"
                                required
                                value={form.dateApplied}
                                onChange={updateField}
                            />
                        </label>
                    </div>
                    <label className={styles.field}>
                        Location
                        <input
                            name="location"
                            maxLength="90"
                            value={form.location}
                            onChange={updateField}
                            placeholder="Remote or city"
                        />
                    </label>
                    <div className={styles.fieldsTwo}>
                        <label className={styles.field}>
                            Next step
                            <input
                                name="nextStep"
                                maxLength="100"
                                value={form.nextStep}
                                onChange={updateField}
                                placeholder="Follow up with the recruiter"
                            />
                        </label>
                        <label className={styles.field}>
                            Next step date
                            <input
                                name="nextDate"
                                type="date"
                                value={form.nextDate}
                                onChange={updateField}
                            />
                        </label>
                    </div>
                    <div className={styles.fieldsTwo}>
                        <label className={styles.field}>
                            Salary range
                            <input
                                name="salary"
                                maxLength="60"
                                value={form.salary}
                                onChange={updateField}
                                placeholder="$100k - $120k"
                            />
                        </label>
                        <label className={styles.field}>
                            Contact name
                            <input
                                name="contactName"
                                maxLength="80"
                                value={form.contactName}
                                onChange={updateField}
                                placeholder="Recruiter or hiring manager"
                            />
                        </label>
                    </div>
                    <div className={styles.fieldsTwo}>
                        <label className={styles.field}>
                            Contact email
                            <input
                                name="contactEmail"
                                type="email"
                                maxLength="254"
                                value={form.contactEmail}
                                onChange={updateField}
                                placeholder="name@example.com"
                            />
                        </label>
                        <label className={styles.field}>
                            Job link
                            <input
                                name="url"
                                type="url"
                                maxLength="300"
                                value={form.url}
                                onChange={updateField}
                                placeholder="https://"
                            />
                        </label>
                    </div>
                    <label className={styles.field}>
                        Notes
                        <textarea
                            name="notes"
                            rows="3"
                            maxLength="500"
                            value={form.notes}
                            onChange={updateField}
                            placeholder="Add a detail to remember for the next conversation"
                        />
                    </label>
                    <div className={styles.actions}>
                        <button
                            className={styles.cancelButton}
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button className={styles.saveButton} type="submit">
                            {application ? "Save changes" : "Save application"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export { ApplicationModal };
