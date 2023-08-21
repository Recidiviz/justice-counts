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
import { useParams } from "react-router-dom";
import useAsyncEffect from "use-async-effect";

import { Loading } from "../Loading";
import { NotFound } from "../NotFound";
import { useStore } from "../stores";
import { isAllowListed } from "../utils/allowlist";

export const Protected: React.FC<PropsWithChildren> = observer(
  ({ children }) => {
    const { agencyDataStore } = useStore();
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);

    useAsyncEffect(async () => {
      try {
        await agencyDataStore.fetchAgencyData(slug as string);
        setLoading(false);
      } catch (error) {
        showToast({
          message: "Error fetching data.",
          color: "red",
          timeout: 4000,
        });
      }
    }, [slug]);

    if (loading) {
      return <Loading />;
    }
    return agencyDataStore.agency && isAllowListed(agencyDataStore.agency) ? (
      <>{children}</>
    ) : (
      <NotFound />
    );
  }
);
