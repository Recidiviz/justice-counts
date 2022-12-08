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

import { AgencySystems } from "@justice-counts/common/types";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import blueCheck from "../assets/status-check-icon.png";
import { Loading } from "../Loading";
import {
  BlueCheckIcon,
  Checkbox,
  CheckboxWrapper,
} from "../MetricConfiguration";
import {
  AgencySettingsBlock,
  AgencySettingsBlockDescription,
  AgencySettingsBlockTitle,
  AgencySettingsContent,
  AgencySettingsInfoRow,
  AgencySettingsWrapper,
  BasicInfoTextArea,
  BasicInfoTextAreaLabel,
  BasicInfoTextAreaWordCounter,
  SupervisionSystemRow,
} from "./AgencySettings.styles";
import useAutosizeTextArea from "./hooks";
import { agencyTeam } from "./mocks";
import { normalizeSystem, removeExcessSpaces } from "./utils";

const supervisionAgencySystems = [
  { label: "Parole", value: "PAROLE" },
  {
    label: "Probation",
    value: "PROBATION",
  },
  { label: "Pretrial Supervision", value: "PRETRIAL_SUPERVISION" },
  { label: "Other", value: "OTHER_SUPERVISION" },
];

export const AgencySettings: React.FC = observer(() => {
  const { agencyStore } = useStore();
  const {
    currentAgency,
    currentAgencySystems,
    isAgencySupervision,
    agencyDescription,
    loadingSettings,
    updatePurposeAndFunctions,
    updateAgencySystems,
    savePurposeAndFunctions,
    resetState,
  } = agencyStore;

  const { agencyId } = useParams();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(textAreaRef.current, agencyDescription);

  const debouncedSave = useRef(debounce(savePurposeAndFunctions, 2500)).current;

  const handleSystemToggle = (systemToToggle: AgencySystems) => {
    if (currentAgencySystems) {
      const systems = currentAgencySystems.includes(systemToToggle)
        ? currentAgencySystems.filter((system) => system !== systemToToggle)
        : currentAgencySystems.concat(systemToToggle);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      updateAgencySystems(systems, agencyId!);
    }
  };

  const wordsCount = agencyDescription
    ? removeExcessSpaces(agencyDescription).split(" ").length
    : 0;

  useEffect(() => {
    const initialize = async () => {
      resetState();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      agencyStore.initCurrentUserAgency(agencyId!);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  if (loadingSettings)
    return (
      <AgencySettingsWrapper>
        <Loading />
      </AgencySettingsWrapper>
    );

  return (
    <AgencySettingsWrapper>
      <AgencySettingsContent>
        <AgencySettingsBlock id="basic-info">
          <AgencySettingsBlockTitle>Basic Information</AgencySettingsBlockTitle>
          <AgencySettingsBlockDescription>
            If any of the below looks incorrect, contact the Justice Counts team
            at{" "}
            <a href="mailto:justice-counts-support@csg.org">
              justice-counts-support@csg.org
            </a>
            .
          </AgencySettingsBlockDescription>
          <AgencySettingsInfoRow>
            Agency Name <span>{currentAgency?.name}</span>
          </AgencySettingsInfoRow>
          <AgencySettingsInfoRow>
            Systems{" "}
            <span>
              {currentAgencySystems
                ?.map((system) => normalizeSystem(system))
                .join(", ")}
            </span>
          </AgencySettingsInfoRow>
          {/* state_code property will be replaced with state */}
          <AgencySettingsInfoRow>
            State <span>{currentAgency?.state}</span>
          </AgencySettingsInfoRow>
          <BasicInfoTextAreaLabel htmlFor="basic-info-description">
            Briefly describe your agency’s purpose and functions (150 words or
            less).
          </BasicInfoTextAreaLabel>
          <BasicInfoTextArea
            id="basic-info-description"
            onChange={(e) => {
              const updateText = updatePurposeAndFunctions(e.target.value);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              debouncedSave(updateText, agencyId!);
            }}
            onKeyPress={(e) => {
              if (wordsCount >= 150 && e.key !== "Backspace") {
                e.preventDefault();
              }
            }}
            placeholder="Type here..."
            ref={textAreaRef}
            rows={1}
            value={agencyDescription}
          />
          <BasicInfoTextAreaWordCounter isRed={wordsCount > 150}>
            {wordsCount}/150 words
          </BasicInfoTextAreaWordCounter>
        </AgencySettingsBlock>
        <AgencySettingsBlock id="team-management">
          <AgencySettingsBlockTitle>Team Management</AgencySettingsBlockTitle>
          <AgencySettingsBlockDescription>
            These are the other people at your agency who have accounts on
            Publisher. If there is someone you work with who you think should be
            on Publisher, contact the Justice Counts team at{" "}
            <a href="mailto:justice-counts-support@csg.org">
              justice-counts-support@csg.org
            </a>
            .
          </AgencySettingsBlockDescription>
          {agencyTeam.map(({ name, email }) => (
            <AgencySettingsInfoRow key={name + email}>
              {name}
              <span>{email}</span>
            </AgencySettingsInfoRow>
          ))}
        </AgencySettingsBlock>
        {isAgencySupervision && (
          <AgencySettingsBlock id="supervision-setup">
            <AgencySettingsBlockTitle>
              Supervision Populations
            </AgencySettingsBlockTitle>
            <AgencySettingsBlockDescription>
              Check the supervision popluations your agency is both responsible
              for AND can disaggregate your data by.
            </AgencySettingsBlockDescription>
            {supervisionAgencySystems.map(({ label, value }) => (
              <SupervisionSystemRow key={value}>
                <CheckboxWrapper>
                  <Checkbox
                    type="checkbox"
                    checked={currentAgencySystems?.includes(
                      value as AgencySystems
                    )}
                    onChange={() => handleSystemToggle(value as AgencySystems)}
                  />
                  <BlueCheckIcon src={blueCheck} alt="" enabled />
                </CheckboxWrapper>
                {label}
              </SupervisionSystemRow>
            ))}
          </AgencySettingsBlock>
        )}
        <AgencySettingsBlock id="jurisdiction">
          <AgencySettingsBlockTitle>Jurisdictions</AgencySettingsBlockTitle>
          <AgencySettingsBlockDescription>
            Select the appropriate geographic area that corresponds with your
            agency. You can indicate multiple cities, counties, states, or other
            census areas that fall within your agency’s jurisdiction.
          </AgencySettingsBlockDescription>
        </AgencySettingsBlock>
      </AgencySettingsContent>
    </AgencySettingsWrapper>
  );
});
