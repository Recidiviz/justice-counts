// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2024 Recidiviz, Inc.
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

import { validateAgencyURL } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";
import { useAgencyProvisioning } from "../AgencyProvisioningContext";

export const AgencyURLInput: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const { updateAgencyURL } = adminPanelStore;

  const { selectedAgency } = useAgencyProvisioning();

  const [URLValue, setURLValue] = useState<string>(
    selectedAgency?.agency_url ?? ""
  );
  const [URLValidationError, setURLValidationError] = useState<string>();

  const validateAndUpdateURL = (url: string) => {
    const isValidURL = validateAgencyURL(url);
    setURLValue(url);

    if (url === "" || isValidURL) {
      updateAgencyURL(url);
      setURLValidationError(undefined);
      return;
    }
    updateAgencyURL(null);
    setURLValidationError("Invalid URL");
  };

  return (
    <Styled.InputLabelWrapper hasError={Boolean(URLValidationError)}>
      <input
        id="agency-url"
        name="agency-url"
        type="text"
        value={URLValue}
        onChange={(e) => validateAndUpdateURL(e.target.value.trimStart())}
      />
      <Styled.LabelWrapper>
        <label htmlFor="agency-url">Agency URL</label>
        {URLValidationError && (
          <Styled.ErrorLabel>{URLValidationError}</Styled.ErrorLabel>
        )}
      </Styled.LabelWrapper>
    </Styled.InputLabelWrapper>
  );
});
