// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2023 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import "react-tooltip/dist/react-tooltip.css";

import { GlobalStyle } from "@justice-counts/common/components/GlobalStyles";
import * as Sentry from "@sentry/react";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

import App from "./App";
import AuthWall from "./components/Auth";
import { StoreProvider } from "./stores";

// Initialize Sentry
Sentry.init({
  dsn: "https://3e8c790dbf0c407b8c039b91c7af9abc@o432474.ingest.sentry.io/4504532096516096",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new Sentry.Replay(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    /^https:\/\/publisher-staging\.justice-counts\.org\/api/,
    /^https:\/\/publisher\.justice-counts\.org\/api/,
  ],

  // Capture Replay for 0% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});

// load analytics
window.analytics = window.analytics || [];
const { analytics } = window;
if (!analytics.initialize) {
  if (analytics.invoked) {
    // eslint-disable-next-line no-console
    console.error("Segment snippet included twice.");
  } else {
    analytics.invoked = true;
    analytics.methods = [
      "trackSubmit",
      "trackClick",
      "trackLink",
      "trackForm",
      "pageview",
      "identify",
      "reset",
      "group",
      "track",
      "ready",
      "alias",
      "debug",
      "page",
      "once",
      "off",
      "on",
      "addSourceMiddleware",
      "addIntegrationMiddleware",
      "setAnonymousId",
      "addDestinationMiddleware",
    ];
    analytics.factory = function (e: unknown) {
      return function () {
        const t = Array.prototype.slice.call(arguments); // eslint-disable-line prefer-rest-params
        t.unshift(e);
        analytics.push(t);
        return analytics;
      };
    };
    for (let e = 0; e < analytics.methods.length; e += 1) {
      const key = analytics.methods[e];
      analytics[key] = analytics.factory(key);
    }
    analytics.load = function (key: unknown, e: unknown) {
      const t = document.createElement("script");
      t.type = "text/javascript";
      t.async = !0;
      t.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;
      const n = document.getElementsByTagName("script")[0];
      n.parentNode?.insertBefore(t, n);
      analytics._loadOptions = e; // eslint-disable-line no-underscore-dangle
    };
    analytics._writeKey = window.SEGMENT_KEY; // eslint-disable-line no-underscore-dangle
    analytics.SNIPPET_VERSION = "4.15.3";
    analytics.load(window.SEGMENT_KEY);
    analytics.page();
  }
}

const rootContainer = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(rootContainer!); // "!"" is required for use with TypeScript

root.render(
  <StoreProvider>
    <GlobalStyle />
    <AuthWall>
      {/** Moved StrictMode to not mount, unmount, and remount AuthWall on the first render
       * since this causes authStore.authenticate to be called twice in rapid succession,
       * which triggers an Auth0 403 error.
       * See https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-strict-mode
       * for more info
       */}

      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </AuthWall>
  </StoreProvider>
);
