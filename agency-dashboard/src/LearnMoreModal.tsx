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

import { ReactComponent as CloseIcon } from "@justice-counts/common/assets/close-icon.svg";
import React from "react";

import {
  LearnMoreModalAgencyName,
  LearnMoreModalCloseButton,
  LearnMoreModalContainer,
  LearnMoreModalInnerContainer,
  LearnMoreModalMetricName,
  LearnMoreModalParagraph,
  LearnMoreModalScrollContainer,
  LearnMoreModalSectionTitle,
} from "./LearnMoreModal.styles";
import { useStore } from "./stores";

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
    <LearnMoreModalContainer>
      <LearnMoreModalScrollContainer>
        <LearnMoreModalCloseButton onClick={closeModal}>
          Close
          <CloseIcon />
        </LearnMoreModalCloseButton>
        <LearnMoreModalInnerContainer>
          <LearnMoreModalAgencyName>
            {agencyDataStore.agency?.name}
          </LearnMoreModalAgencyName>
          <LearnMoreModalMetricName>
            {metric.display_name}
          </LearnMoreModalMetricName>
          <LearnMoreModalParagraph>
            {metric.description}
          </LearnMoreModalParagraph>
          {metric.definitions.length > 0 && (
            <>
              <LearnMoreModalSectionTitle>
                Definitions
              </LearnMoreModalSectionTitle>
              {metric.definitions.map((definition) => (
                <LearnMoreModalParagraph>
                  <span>{definition.term}</span>
                  {`: ${definition.definition}`}
                </LearnMoreModalParagraph>
              ))}
            </>
          )}
          {additionalContext && (
            <>
              <LearnMoreModalSectionTitle>Context</LearnMoreModalSectionTitle>
              <LearnMoreModalParagraph>
                {additionalContext}
              </LearnMoreModalParagraph>
            </>
          )}
          {metric.settings && metric.settings.length > 0 && (
            <>
              <LearnMoreModalSectionTitle>Settings</LearnMoreModalSectionTitle>
              {metric.settings.map((setting) => (
                <LearnMoreModalParagraph>
                  <span>{setting.label}</span>
                  {`: ${setting.included}`}
                </LearnMoreModalParagraph>
              ))}
            </>
          )}
        </LearnMoreModalInnerContainer>
      </LearnMoreModalScrollContainer>
    </LearnMoreModalContainer>
  );
};
