import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/job-application-tracker/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
