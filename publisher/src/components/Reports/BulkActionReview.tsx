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

import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { RecordsBulkAction } from "../../pages/Reports";
import { useStore } from "../../stores";
import { PageWrapper } from "../Forms";
import { Loading } from "../Loading";
import BulkActionReviewConfirmation from "./BulkActionReviewConfirmation";

const BulkActionReview = () => {
  const params = useParams();
  const { state } = useLocation();
  const { recordsIds, action } = state as {
    recordsIds: number[];
    action: RecordsBulkAction;
  };
  const agencyId = Number(params.agencyId);
  const { reportStore, datapointsStore } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const initialize = async () => {
      // probably need better way to get reports metrics
      await datapointsStore.getDatapoints(agencyId);
      const result = await reportStore.initializeReportSettings(
        agencyId.toString()
      );
      if (result instanceof Error) {
        setIsLoading(false);
        return setLoadingError(result.message);
      }
      setIsLoading(false);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || datapointsStore.loading)
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );

  if (loadingError) {
    return <div>Error: {loadingError}</div>;
  }

  return (
    <BulkActionReviewConfirmation recordsIds={recordsIds} action={action} />
  );
};

export default observer(BulkActionReview);
