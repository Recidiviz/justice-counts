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

import { showToast } from "@justice-counts/common/components/Toast";
import { observer } from "mobx-react-lite";
import React, { PropsWithChildren, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

import { Loading } from "../Loading";
import { NotFound } from "../NotFound";
import { useStore } from "../stores";
import { environment } from "../stores/API";

export const Protected: React.FC<PropsWithChildren> = observer(
  ({ children }) => {
    const navigate = useNavigate();
    const { agencyDataStore, api } = useStore();
    const { slug } = useParams();
    const isProductionEnv = api.environment === environment.PRODUCTION;
    const isDenied =
      agencyDataStore.agency &&
      agencyDataStore.agency.is_dashboard_enabled !== true;

    const [loading, setLoading] = useState(true);

    useAsyncEffect(async () => {
      try {
        await agencyDataStore.fetchAgencyData(slug as string);
        setLoading(false);
      } catch (error) {
        navigate("/404");
        showToast({
          message: `No agency found with path /${slug}.`,
          color: "red",
          timeout: 4000,
        });
      }
    }, [slug]);

    if (loading) {
      return <Loading />;
    }

    if (!isProductionEnv) {
      return <>{children}</>;
    }

    return isDenied ? <NotFound /> : <>{children}</>;
  }
);
