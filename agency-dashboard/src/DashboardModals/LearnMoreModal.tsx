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

import { ReactComponent as CloseIcon } from "@justice-counts/common/assets/close-icon.svg";
import React from "react";

import { useStore } from "../stores";
import {
  ModalCloseButton,
  ModalContainer,
  ModalInnerContainer,
  ModalParagraph,
  ModalScrollContainer,
  ModalSectionTitle,
  ModalSubtitle,
  ModalTitle,
} from "./DashboardModal.styles";

export const LearnMoreModal: React.FC<{
  closeModal: () => void;
  metricKey: string;
}> = ({ closeModal, metricKey }) => {
  const { agencyDataStore } = useStore();
  const metric = agencyDataStore.metricsByKey[metricKey];
  if (!metric) {
    return null;
  }
  const additionalContext = metric.contexts.find(
    (context) => context.key === "ADDITIONAL_CONTEXT"
  )?.value;
  return (
    <ModalContainer>
      <ModalScrollContainer>
        <ModalCloseButton onClick={closeModal}>
          Close
          <CloseIcon />
        </ModalCloseButton>
        <ModalInnerContainer>
          <ModalSubtitle>{agencyDataStore.agency?.name}</ModalSubtitle>
          <ModalTitle>{metric.display_name}</ModalTitle>
          <ModalParagraph>{metric.description}</ModalParagraph>
          {metric.definitions.length > 0 && (
            <>
              <ModalSectionTitle>Metric Definitions</ModalSectionTitle>
              {metric.definitions.map((definition) => (
                <ModalParagraph key={definition.term}>
                  <span>{definition.term}</span>
                  {`: ${definition.definition}`}
                </ModalParagraph>
              ))}
            </>
          )}
          {additionalContext && (
            <>
              <ModalSectionTitle>Context</ModalSectionTitle>
              <ModalParagraph>{additionalContext}</ModalParagraph>
            </>
          )}
          {metric.includes_excludes && metric.includes_excludes.length > 0 && (
            <>
              <ModalSectionTitle>Settings</ModalSectionTitle>
              {metric.includes_excludes?.forEach((includesExcludes) =>
                includesExcludes.settings.map((setting) => (
                  <ModalParagraph>
                    <span>{setting.label}</span>
                    {`: ${setting.included}`}
                  </ModalParagraph>
                ))
              )}
            </>
          )}
        </ModalInnerContainer>
      </ModalScrollContainer>
    </ModalContainer>
  );
};
