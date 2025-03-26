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

import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../../stores";
import * as Styled from "../AdminPanel.styles";

const SteppingUpAgencyCheckbox: React.FC = observer(() => {
  const { adminPanelStore } = useStore();
  const { agencyProvisioningUpdates, updateIsSteppingUpAgency } =
    adminPanelStore;

  return (
    <Styled.InputLabelWrapper flexRow>
      <input
        id="stepping-up-agency"
        name="stepping-up-agency"
        type="checkbox"
        onChange={() =>
          updateIsSteppingUpAgency(
            !agencyProvisioningUpdates.is_stepping_up_agency
          )
        }
        checked={Boolean(agencyProvisioningUpdates.is_stepping_up_agency)}
      />
      <label htmlFor="stepping-up-agency">Stepping Up Agency</label>
    </Styled.InputLabelWrapper>
  );
});

export default SteppingUpAgencyCheckbox;
