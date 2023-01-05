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

import blueCheck from "@justice-counts/common/assets/status-check-icon.png";
import { AgencySystems, Permission } from "@justice-counts/common/types";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
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
import { normalizeSystem } from "./utils";

const supervisionAgencySystems: { label: string; value: AgencySystems }[] = [
  { label: "Parole", value: "PAROLE" },
  {
    label: "Probation",
    value: "PROBATION",
  },
  { label: "Pretrial Supervision", value: "PRETRIAL_SUPERVISION" },
  { label: "Other", value: "OTHER_SUPERVISION" },
];

export const AgencySettings: React.FC = observer(() => {
  const { agencyStore, userStore } = useStore();
  const {
    currentAgency,
    settings,
    loadingSettings,
    currentAgencySystems,
    isAgencySupervision,
    updateAgencySettings,
    saveAgencySettings,
    resetState,
  } = agencyStore;

  const { agencyId } = useParams();

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const systemsToSave = (systemToToggle: AgencySystems): AgencySystems[] => {
    if (!currentAgencySystems) return [systemToToggle];
    return currentAgencySystems.includes(systemToToggle)
      ? currentAgencySystems.filter((system) => system !== systemToToggle)
      : currentAgencySystems.concat(systemToToggle);
  };

  const debouncedSave = useRef(debounce(saveAgencySettings, 1500)).current;

  const isAdmin = userStore.permissions.includes(Permission.RECIDIVIZ_ADMIN);

  const agencyTeam = userStore
    .getAgency(agencyId)
    ?.team.filter((member) => member.auth0_user_id !== userStore.auth0UserID)
    .sort((a, b) => a.name.localeCompare(b.name));

  const charactersCount = settings.PURPOSE_AND_FUNCTIONS.length;

  useEffect(() => {
    const initialize = async () => {
      resetState();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      agencyStore.initCurrentUserAgency(agencyId!);
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  useEffect(() => {
    if (textAreaRef.current) {
      // eslint-disable-next-line no-param-reassign
      textAreaRef.current.style.height = "0px";
      const { scrollHeight } = textAreaRef.current;

      // eslint-disable-next-line no-param-reassign
      textAreaRef.current.style.height = `${Number(scrollHeight) + 1}px`;
    }
  }, [settings.PURPOSE_AND_FUNCTIONS]);

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
          <AgencySettingsInfoRow>
            State <span>{currentAgency?.state}</span>
          </AgencySettingsInfoRow>
          <BasicInfoTextAreaLabel htmlFor="basic-info-description">
            Briefly describe your agency’s purpose and functions (750 characters
            or less).
          </BasicInfoTextAreaLabel>
          <BasicInfoTextArea
            id="basic-info-description"
            onChange={(e) => {
              const updatedSettings = updateAgencySettings(
                e.target.value,
                currentAgencySystems
              );
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              debouncedSave(updatedSettings, agencyId!);
            }}
            placeholder="Type here..."
            ref={textAreaRef}
            rows={1}
            value={settings.PURPOSE_AND_FUNCTIONS}
            maxLength={750}
          />
          <BasicInfoTextAreaWordCounter isRed={charactersCount >= 750}>
            {charactersCount}/750 characters
          </BasicInfoTextAreaWordCounter>
        </AgencySettingsBlock>
        {isAdmin && (
          <AgencySettingsBlock id="team-management">
            <AgencySettingsBlockTitle>Team Management</AgencySettingsBlockTitle>
            <AgencySettingsBlockDescription>
              These are the other people at your agency who have accounts on
              Publisher. If there is someone you work with who you think should
              be on Publisher, contact the Justice Counts team at{" "}
              <a href="mailto:justice-counts-support@csg.org">
                justice-counts-support@csg.org
              </a>
              .
            </AgencySettingsBlockDescription>
            {agencyTeam?.map(({ name }) => (
              <AgencySettingsInfoRow key={name}>
                {name}
                {/* email is mocked */}
                <span>{`${name}@doc1.wa.gov`}</span>
              </AgencySettingsInfoRow>
            ))}
          </AgencySettingsBlock>
        )}
        {isAgencySupervision && (
          <AgencySettingsBlock id="supervision-setup">
            <AgencySettingsBlockTitle>
              Supervision Populations
            </AgencySettingsBlockTitle>
            <AgencySettingsBlockDescription>
              Check the supervision populations your agency is both responsible
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
                    onChange={() => {
                      const systems = systemsToSave(value);
                      const updatedSettings = updateAgencySettings(
                        settings.PURPOSE_AND_FUNCTIONS,
                        systems
                      );
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      debouncedSave(updatedSettings, agencyId!);
                    }}
                  />
                  <BlueCheckIcon src={blueCheck} alt="" enabled />
                </CheckboxWrapper>
                {label}
              </SupervisionSystemRow>
            ))}
          </AgencySettingsBlock>
        )}
        {isAdmin && (
          <AgencySettingsBlock id="jurisdiction">
            <AgencySettingsBlockTitle>Jurisdictions</AgencySettingsBlockTitle>
            <AgencySettingsBlockDescription>
              Select the appropriate geographic area that corresponds with your
              agency. You can indicate multiple cities, counties, states, or
              other census areas that fall within your agency’s jurisdiction.
            </AgencySettingsBlockDescription>
          </AgencySettingsBlock>
        )}
      </AgencySettingsContent>
    </AgencySettingsWrapper>
  );
});
