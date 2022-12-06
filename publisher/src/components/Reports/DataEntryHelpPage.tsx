// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2022 Recidiviz, Inc.
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

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  REPORT_LOWERCASE,
  REPORTING_LOWERCASE,
  REPORTING_PERIOD_LOWERCASE,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import {
  DataEntryHelpPageDivider,
  DataEntryHelpPageLink,
  DataEntryHelpPageListItem,
  DataEntryHelpPageListItemText,
  DataEntryHelpPageSubTitle,
  DataEntryHelpPageText,
  DataEntryHelpPageTitle,
  DataEntryHelpPageWrapper,
  ListMarker,
} from "./DataEntryHelpPage.styles";

const DataEntryHelpPage: React.FC<{
  showDataEntryHelpPage: boolean;
  closeHelpPage: () => void;
}> = ({ showDataEntryHelpPage, closeHelpPage }) => {
  const { agencyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (showDataEntryHelpPage) {
      document.getElementById("data-entry-help-page")?.focus();
    }
  }, [showDataEntryHelpPage]);

  return (
    <DataEntryHelpPageWrapper
      id="data-entry-help-page"
      tabIndex={-1}
      showOnboarding={showDataEntryHelpPage}
      onBlur={closeHelpPage}
    >
      <DataEntryHelpPageTitle>
        How to Use the Data Entry View
      </DataEntryHelpPageTitle>
      <DataEntryHelpPageSubTitle>
        The purpose of this page is to enter data for a given{" "}
        {REPORTING_PERIOD_LOWERCASE}. (You can access all {REPORTS_LOWERCASE}{" "}
        from the{" "}
        <DataEntryHelpPageLink
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          {REPORTS_CAPITALIZED}
        </DataEntryHelpPageLink>{" "}
        page.)
      </DataEntryHelpPageSubTitle>
      <DataEntryHelpPageText>
        Each metric is composed of three components:
        <DataEntryHelpPageListItem>
          <ListMarker />
          <DataEntryHelpPageListItemText>
            <strong>Primary Value: </strong>
            The top-level value associated with the metric.
          </DataEntryHelpPageListItemText>
        </DataEntryHelpPageListItem>
        <DataEntryHelpPageListItem>
          <ListMarker />
          <DataEntryHelpPageListItemText>
            <strong>Breakdowns: </strong>
            Subdivisions of the primary value (e.g., staff types, race, gender,
            etc).
          </DataEntryHelpPageListItemText>
        </DataEntryHelpPageListItem>
      </DataEntryHelpPageText>
      <DataEntryHelpPageText>
        We’ve also included additional descriptions and definitions on the
        right-side panel, including the definition of the metric, definitions
        for any terms, and {REPORTING_LOWERCASE} on how the metric should be
        calculated.
      </DataEntryHelpPageText>
      <DataEntryHelpPageSubTitle>
        Whenever you have finished entering data, you can click the Review
        button at the top of the page.
      </DataEntryHelpPageSubTitle>
      <DataEntryHelpPageText>
        Clicking this button will first take you to a page to review the numbers
        that you have entered before publishing. Publishing the data will mark
        the {REPORT_LOWERCASE} as “Published” in the {REPORTS_CAPITALIZED} View
        and the underlying data will be accessible to the public.
      </DataEntryHelpPageText>
      <DataEntryHelpPageText>
        After publishing the data, you can always go back to edit the data that
        you have entered.
      </DataEntryHelpPageText>
      <DataEntryHelpPageDivider />
      <DataEntryHelpPageText>
        If you have any further questions about how this page works, please
        email the Justice Counts team at{" "}
        <a href="mailto:justice-counts-support@csg.org">
          justice-counts-support@csg.org
        </a>
        .
      </DataEntryHelpPageText>
    </DataEntryHelpPageWrapper>
  );
};

export default DataEntryHelpPage;
