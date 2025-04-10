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

import { Button } from "@justice-counts/common/components/Button";
import { CheckboxOptions } from "@justice-counts/common/components/CheckboxOptions";
import { Modal } from "@justice-counts/common/components/Modal";
import { AgencySystems } from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { cloneDeep, startCase } from "lodash";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { SettingProps } from "./AgencySettings";
import {
  AgencyInfoBlockDescription,
  AgencySettingsBlock,
  BasicInfoBlockTitle,
  DataSourceContainer,
  EditButtonContainer,
  SteppingUpQuestionWrapper,
  SteppingUpSubtitle,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

const screeningTimingMapping = [
  { key: "no_screening", label: "No screening administered" },
  { key: "intake", label: "Screen everyone during intake" },
  {
    key: "different_point_in_time",
    label: "Screen everyone at a different point in time",
  },
  { key: "ad-hoc", label: "Screen individuals on an ad-hoc basis" },
];

const toolsMapping = [
  { key: "BJMHS", label: "Brief Jail Mental Health Screen (BJMHS)" },
  {
    key: "CMHS-M",
    label: "Correctional Mental Health Screen for Men (CMHS-M)",
  },
  {
    key: "CMHS-W",
    label: "Correctional Mental Health Screen for Women (CMHS-W)",
  },
  {
    key: "MENTAL_HEALTH_SCREENING_FORM_III",
    label: "Mental Health Screening Form-III",
  },
  { key: "TCU", label: "Texas Christian University (TCU) Drug Screen 5" },
  { key: "SSI", label: "Simple Screening Instrument (SSI)" },
  {
    key: "AUDIT",
    label: "Alcohol Use Disorders Identification Test (AUDIT)",
  },
  {
    key: "ASSIST",
    label:
      "Alcohol, Smoking, and Substance Involvement Screening Test (ASSIST)",
  },
  {
    key: "MINI-Screen",
    label: "Mini International Neuropsychiatric Interview-Screen (MINI-Screen)",
  },
  { key: "DAST-10", label: "Drug Abuse Screening Test (DAST-10)" },
  { key: "COWS", label: "Clinical Opiate Withdrawal Scale (COWS)" },
  {
    key: "CIWA-Ar",
    label:
      "Clinical Institute Withdrawal Assessment of Alcohol Scale, Revised (CIWA-Ar)",
  },
  {
    key: "CIWA-B",
    label: "Clinical Institute Withdrawal Assessment-Benzodiazepines (CIWA-B)",
  },
  { key: "CAGE-AID", label: "CAGE-AID" },
  {
    key: "DEVELOPED_BY_PROVIDER",
    label:
      "Screening tool developed by contracted medical/behavioral health provider",
  },
  { key: "C-SSRS", label: "Columbia Suicide Severity Risk Scale (C-SSRS)" },
  { key: "N/A", label: "Not Applicable" },
  { key: "OTHER", label: "Other" },
];

const steppingUpSettingMapping = {
  identifies_behavioral_needs: [
    { key: "YES", label: "Yes" },
    { key: "NO", label: "No" },
  ],
  screening_timing: {
    mental_health: screeningTimingMapping,
    substance_use: screeningTimingMapping,
    other_behavioral_health: screeningTimingMapping,
  },
  tools: toolsMapping,
};

const emptySteppingUpSetting = {
  identifies_behavioral_needs: null,
  screening_timing: {
    mental_health: {
      no_screening: false,
      intake: false,
      different_point_in_time: false,
      "ad-hoc": false,
    },
    substance_use: {
      no_screening: false,
      intake: false,
      different_point_in_time: false,
      "ad-hoc": false,
    },
    other_behavioral_health: {
      no_screening: false,
      intake: false,
      different_point_in_time: false,
      "ad-hoc": false,
    },
  },
  tools: {
    BJMHS: false,
    "CMHS-M": false,
    "CMHS-W": false,
    MENTAL_HEALTH_SCREENING_FORM_III: false,
    TCU: false,
    SSI: false,
    AUDIT: false,
    ASSIST: false,
    "MINI-Screen": false,
    "DAST-10": false,
    COWS: false,
    "CIWA-Ar": false,
    "CIWA-B": false,
    "CAGE-AID": false,
    DEVELOPED_BY_PROVIDER: false,
    "C-SSRS": false,
    "N/A": false,
    OTHER: false,
  },
  other_description: "",
};

type SteppingUpSetting = {
  identifies_behavioral_needs: boolean | null;
  screening_timing: ScreeningTimingType;
  tools: ToolsType;
  other_description: string;
};

type ScreeningTimingType = {
  mental_health: ScreeningTimingEntry;
  substance_use: ScreeningTimingEntry;
  other_behavioral_health: ScreeningTimingEntry;
};

type ScreeningTimingEntry = {
  no_screening: boolean;
  intake: boolean;
  different_point_in_time: boolean;
  "ad-hoc": boolean;
};

type ToolsType = {
  BJMHS: boolean;
  "CMHS-M": boolean;
  "CMHS-W": boolean;
  MENTAL_HEALTH_SCREENING_FORM_III: boolean;
  TCU: boolean;
  SSI: boolean;
  AUDIT: boolean;
  ASSIST: boolean;
  "MINI-Screen": boolean;
  "DAST-10": boolean;
  COWS: boolean;
  "CIWA-Ar": boolean;
  "CIWA-B": boolean;
  "CAGE-AID": boolean;
  DEVELOPED_BY_PROVIDER: boolean;
  "C-SSRS": boolean;
  "N/A": boolean;
  OTHER: boolean;
};

const SteppingUpContextualInformation: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore } = useStore();
  const {
    currentAgency,
    currentAgencySettings,
    updateAgencySettings,
    saveAgencySettings,
  } = agencyStore;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const steppingUpSetting = useMemo(() => {
    return (
      (currentAgencySettings?.find(
        (setting) => setting.setting_type === "STEPPING_UP"
      )?.value as SteppingUpSetting) || {}
    );
  }, [currentAgencySettings]);

  const isSettingConfigured = Object.keys(steppingUpSetting).length > 0;

  const defaultSetting = isSettingConfigured
    ? cloneDeep(steppingUpSetting)
    : cloneDeep(emptySteppingUpSetting);

  const [updatedSetting, setUpdatedSetting] = useState(defaultSetting);

  useEffect(() => {
    setUpdatedSetting(defaultSetting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steppingUpSetting]);

  const handleSaveClick = () => {
    const updatedSettings = updateAgencySettings(
      "STEPPING_UP",
      updatedSetting,
      parseInt(agencyId)
    );
    saveAgencySettings(updatedSettings, agencyId);
    removeEditMode();
  };

  const handleCancelClick = () => {
    if (JSON.stringify(updatedSetting) === JSON.stringify(defaultSetting)) {
      removeEditMode();
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const handleCancelModalConfirm = () => {
    setUpdatedSetting(defaultSetting);
    setIsConfirmModalOpen(false);
    removeEditMode();
  };

  const screeningTimingKeys = Object.keys(
    steppingUpSettingMapping.screening_timing
  ) as Array<keyof ScreeningTimingType>;

  const showSetting =
    currentAgency?.systems.includes(AgencySystems.JAILS) &&
    currentAgency?.is_stepping_up_agency;

  if (!showSetting) return null;

  return (
    <>
      {isSettingInEditMode && (
        <AgencySettingsEditModeModal
          openCancelModal={handleCancelClick}
          isConfirmModalOpen={isConfirmModalOpen}
          closeCancelModal={() => setIsConfirmModalOpen(false)}
          handleCancelModalConfirm={handleCancelModalConfirm}
        >
          <Modal
            title="Stepping Up Contextual Information"
            description={
              <DataSourceContainer>
                {/* identifies behavioral needs */}
                <SteppingUpQuestionWrapper>
                  Does your agency identify individuals with behavioral health
                  needs?
                </SteppingUpQuestionWrapper>
                <SteppingUpSubtitle small>
                  Behavioral health generally refers to mental health
                  conditions, substance use disorders, major life stressors,
                  crises, or stress-related physical symptoms.
                </SteppingUpSubtitle>
                <CheckboxOptions
                  multiselect={false}
                  options={steppingUpSettingMapping.identifies_behavioral_needs.map(
                    (mapObj) => {
                      const value = mapObj.key === "YES";
                      return {
                        key: mapObj.key,
                        label: mapObj.label,
                        checked:
                          updatedSetting.identifies_behavioral_needs === value,
                      };
                    }
                  )}
                  onChange={({ key, checked }) => {
                    setUpdatedSetting((prev) => ({
                      ...prev,
                      identifies_behavioral_needs: checked
                        ? false
                        : key === "YES",
                    }));
                  }}
                />

                {/* screening timing */}
                <SteppingUpQuestionWrapper>
                  When does your agency screen individuals with behavioral
                  health needs? (Select all that apply)
                </SteppingUpQuestionWrapper>
                <SteppingUpSubtitle small>
                  Screening: A brief, routine process designed to identify
                  indicators of the presence of behavioral health needs.
                  Screening does not require staff who are licensed, certified,
                  or credentialed in a behavioral health field.
                </SteppingUpSubtitle>
                {screeningTimingKeys.map((screeningTimingKey) => (
                  <React.Fragment key={screeningTimingKey}>
                    <SteppingUpSubtitle>
                      {startCase(removeSnakeCase(screeningTimingKey))}
                    </SteppingUpSubtitle>
                    <CheckboxOptions
                      options={steppingUpSettingMapping.screening_timing[
                        screeningTimingKey
                      ].map((mapObj) => ({
                        key: mapObj.key,
                        label: mapObj.label,
                        checked:
                          updatedSetting.screening_timing[screeningTimingKey][
                            mapObj.key as keyof ScreeningTimingEntry
                          ],
                      }))}
                      onChange={({ key, checked }) =>
                        setUpdatedSetting((prev) => ({
                          ...prev,
                          screening_timing: {
                            ...prev.screening_timing,
                            [screeningTimingKey]: {
                              ...prev.screening_timing[screeningTimingKey],
                              [key]: !checked,
                            },
                          },
                        }))
                      }
                    />
                  </React.Fragment>
                ))}

                {/* tools */}
                <SteppingUpQuestionWrapper>
                  What tools does your agency use to identify behavioral health
                  needs? (Select all that apply)
                </SteppingUpQuestionWrapper>
                <CheckboxOptions
                  options={steppingUpSettingMapping.tools.map((mapObj) => {
                    const otherDescriptionParams = {
                      isEnabled:
                        updatedSetting.tools.OTHER && mapObj.key === "OTHER",
                      placeholder:
                        "Please describe other tools your agency uses to identify behavioral health needs...",
                      value: updatedSetting.other_description,
                      onChange: (value: string) =>
                        setUpdatedSetting((prev) => ({
                          ...prev,
                          other_description: value,
                        })),
                    };

                    return {
                      key: mapObj.key,
                      label: mapObj.label,
                      checked:
                        updatedSetting.tools[mapObj.key as keyof ToolsType],
                      otherDescription: otherDescriptionParams,
                    };
                  })}
                  onChange={({ key, checked }) =>
                    setUpdatedSetting((prev) => ({
                      ...prev,
                      tools: {
                        ...prev.tools,
                        [key]: !checked,
                      },
                    }))
                  }
                />
              </DataSourceContainer>
            }
            buttons={[
              {
                label: "Save",
                onClick: () => {
                  handleSaveClick();
                },
              },
            ]}
            maxHeight={777}
            modalBackground="opaque"
            onClickClose={handleCancelClick}
            agencySettingsConfigs
            jurisdictionsSettingsConfigs
            agencySettingsAndJurisdictionsTitleConfigs
            customPadding="4px 40px 24px 40px"
          />
        </AgencySettingsEditModeModal>
      )}

      <AgencySettingsBlock withBorder id="stepping_up">
        <BasicInfoBlockTitle configured={isSettingConfigured}>
          Stepping Up Contextual Information
          {allowEdit && (
            <EditButtonContainer>
              <Button
                label={<>Edit</>}
                onClick={() => {
                  openSetting();
                }}
                labelColor="blue"
                noSidePadding
                noHover
              />
            </EditButtonContainer>
          )}
        </BasicInfoBlockTitle>
        <AgencyInfoBlockDescription>
          Describe when your agency screens individuals with behavioral health
          needs and the tools your agency uses to screen
        </AgencyInfoBlockDescription>
      </AgencySettingsBlock>
    </>
  );
};

export default observer(SteppingUpContextualInformation);
