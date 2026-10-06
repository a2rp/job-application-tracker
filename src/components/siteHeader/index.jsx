import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FiBriefcase, FiMenu, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const SiteHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;

        const closeOnOutsideClick = (event) => {
            if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
        };
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        document.addEventListener("mousedown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);
    const navClass = [styles.mainNav, menuOpen ? styles.open : ""]
        .filter(Boolean)
        .join(" ");

    return (
        <header className={styles.header} ref={headerRef}>
            <div className={styles.inner}>
                <a className={styles.brand} href="#top" onClick={closeMenu}>
                    <span className={styles.brandMark}>
                        <FiBriefcase aria-hidden="true" />
                    </span>
                    <span>rolebook<span className={styles.brandDot}>.</span></span>
                </a>
                <nav
                    className={navClass}
                    id="site-navigation"
                    aria-label="Main navigation"
                >
                    <a href="#applications" onClick={closeMenu}>Applications</a>
                    <a href="#follow-ups" onClick={closeMenu}>Follow-ups</a>
                </nav>
                <div className={styles.actions}>
                    <a
                        className={styles.repositoryLink}
                        href="https://github.com/a2rp/job-application-tracker"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FaGithub aria-hidden="true" />
                        <span>Repository</span>
                    </a>
                    <button
                        className={styles.menuButton}
                        type="button"
                        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={menuOpen}
                        aria-controls="site-navigation"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export { SiteHeader };
