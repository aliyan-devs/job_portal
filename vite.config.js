import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Actions sets GITHUB_ACTIONS=true, so only the Pages build uses the sub-path.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/job_portal/" : "/",
  plugins: [react()],
});
