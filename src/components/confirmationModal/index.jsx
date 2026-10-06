import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./styles.module.css";

const ConfirmationModal = ({
    title,
    description,
    confirmLabel = "Remove application",
    onCancel,
    onConfirm,
}) => {
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        const previousElement = document.activeElement;
        cancelButtonRef.current?.focus();

        const handleKeys = (keyEvent) => {
            if (keyEvent.key === "Escape") {
                onCancel();
                return;
            }

            if (keyEvent.key !== "Tab") return;

            const buttons = keyEvent.currentTarget.querySelectorAll("button");
            const firstButton = buttons[0];
            const lastButton = buttons[buttons.length - 1];

            if (keyEvent.shiftKey && document.activeElement === firstButton) {
                keyEvent.preventDefault();
                lastButton.focus();
            } else if (
                !keyEvent.shiftKey &&
                document.activeElement === lastButton
            ) {
                keyEvent.preventDefault();
                firstButton.focus();
            }
        };

        const dialog = document.querySelector('[role="dialog"]');
        dialog?.addEventListener("keydown", handleKeys);

        return () => {
            dialog?.removeEventListener("keydown", handleKeys);
            previousElement?.focus?.();
        };
    }, [onCancel]);

    return (
        <div
            className={styles.overlay}
            role="presentation"
            onMouseDown={(mouseEvent) => {
                if (mouseEvent.target === mouseEvent.currentTarget) onCancel();
            }}
        >
            <section
                className={styles.dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="remove-title"
                aria-describedby="remove-description"
            >
                <span className={styles.warningIcon}>
                    <FiAlertTriangle aria-hidden="true" />
                </span>
                <h2 id="remove-title">{title}</h2>
                <p id="remove-description">{description}</p>
                <div className={styles.actions}>
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onCancel}
                    >
                        Keep it
                    </button>
                    <button
                        className={styles.confirmButton}
                        type="button"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
};

export { ConfirmationModal };
