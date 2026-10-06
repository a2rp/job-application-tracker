import { FaFacebookF, FaGithub, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import {
    FiCode,
    FiCodepen,
    FiCoffee,
    FiGlobe,
    FiHeart,
    FiMail,
} from "react-icons/fi";
import styles from "./styles.module.css";

const footerLinks = [
    { label: "Portfolio", url: "https://www.ashishranjan.net", icon: FiGlobe },
    { label: "GitHub", url: "https://github.com/a2rp", icon: FaGithub },
    { label: "CodePen", url: "https://codepen.io/ash1198", icon: FiCodepen },
    {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/aashishranjan",
        icon: FaLinkedinIn,
    },
    {
        label: "Facebook",
        url: "https://www.facebook.com/theash.ashish/",
        icon: FaFacebookF,
    },
    {
        label: "YouTube",
        url: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1",
        icon: FaYoutube,
    },
    { label: "Email", url: "mailto:ash.ranjan09@gmail.com", icon: FiMail },
    {
        label: "Support",
        url: "https://a2rp-donation-page.netlify.app/",
        icon: FiHeart,
    },
    {
        label: "Buy Me a Coffee",
        url: "https://buymeacoffee.com/ashishranjan",
        icon: FiCoffee,
    },
    {
        label: "Patreon",
        url: "https://www.patreon.com/ashishranjan",
        icon: FiHeart,
    },
    {
        label: "Source code",
        url: "https://github.com/a2rp/job-application-tracker",
        icon: FiCode,
    },
];

const SiteFooter = () => (
    <footer className={styles.footer}>
        <div className={styles.inner}>
            <div className={styles.copyright}>
                <a
                    className={styles.logoLink}
                    href="https://www.ashishranjan.net"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Ashish Ranjan portfolio"
                >
                    <img
                        src={import.meta.env.BASE_URL + "logo.png"}
                        alt="Ashish Ranjan logo"
                    />
                </a>
                <p>
                    {"\u00a9"} {new Date().getFullYear()}{" "}
                    <a href="https://github.com/a2rp">Ashish Ranjan</a>. All
                    rights reserved.
                </p>
            </div>
            <nav className={styles.footerLinks} aria-label="Footer links">
                {footerLinks.map(({ label, url, icon: Icon }) => (
                    <a
                        href={url}
                        key={label}
                        target={
                            url.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel={
                            url.startsWith("mailto:") ? undefined : "noreferrer"
                        }
                    >
                        <Icon aria-hidden="true" />
                        {label}
                    </a>
                ))}
            </nav>
        </div>
    </footer>
);

export { SiteFooter };
