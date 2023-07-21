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

import { Modal } from "@justice-counts/common/components/Modal";
import React from "react";
import { useLocation } from "react-router-dom";

import { removeAgencyFromPath } from "../../utils";
import { REPORT_LOWERCASE, REPORTS_LOWERCASE } from "../Global/constants";

import { ResourceType, resourceTypeToDisplayName } from ".";

export const UnauthorizedDeleteActionModal: React.FC<{
  closeModal: () => void;
  resourceType: ResourceType;
}> = ({ closeModal, resourceType }) => {
  return (
    <Modal
      title={
        <>
          Please reach out to{" "}
          <a href="mailto:justice-counts-support@csg.org">
            justice-counts-support@csg.org
          </a>{" "}
          if you would like to delete a{" "}
          {resourceTypeToDisplayName[resourceType]}.
        </>
      }
      description=""
      primaryButton={{
        label: "OK",
        onClick: closeModal,
      }}
      modalType="alert"
      centerText
      centerButtons
      mediumTitle
    />
  );
};
