import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const mimeTypes = {
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pdf": "application/pdf",
  ".mp3": "audio/mpeg",
};

export default defineConfig({
  integrations: [react()],
  vite: {
    ssr: {
      noExternal: ["html2pdf.js"],
    },
    optimizeDeps: {
      include: ["html2pdf.js"],
    },
    plugins: [
      {
        name: "set-mime-types",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || "";
            const ext = url.substring(url.lastIndexOf("."));
            if (mimeTypes[ext]) {
              res.setHeader("Content-Type", mimeTypes[ext]);
            }
            next();
          });
        },
      },
    ],
  },
});
