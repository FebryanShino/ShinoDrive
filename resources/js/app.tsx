import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import "boxicons";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { route as routeFn } from "ziggy-js";
import { AudioProvider } from "./components/music-context";
import { useMediaSession } from "./hooks/use-media-session";

declare global {
  const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob("./pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    const Root = () => {
      useMediaSession();

      return <App {...props} />;
    };

    root.render(
      <AudioProvider>
        <Root />
      </AudioProvider>,
    );
  },
  progress: {
    color: "#4B5563",
  },
});

// This will set light / dark mode on load...
// initializeTheme();
