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
import {
  emptySteppingUpSetting,
  steppingUpSettingMapping,
} from "./SteppingUpContext/steppingUpContext";
import {
  ScreeningTimingEntry,
  ScreeningTimingType,
  SteppingUpSettingType,
  ToolsType,
} from "./SteppingUpContext/types";

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
      )?.value as SteppingUpSettingType) || {}
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

  const toolsCheckboxOptions = steppingUpSettingMapping.tools.map((mapObj) => {
    const isOtherChecked = updatedSetting.tools.OTHER && mapObj.key === "OTHER";
    const otherDescriptionParams = {
      isEnabled: isOtherChecked,
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
      checked: updatedSetting.tools[mapObj.key as keyof ToolsType],
      otherDescription: otherDescriptionParams,
    };
  });

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
            fixedTopBottom
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
                  options={toolsCheckboxOptions}
                  onChange={({ key, checked }) =>
                    setUpdatedSetting((prev) => ({
                      ...prev,
                      tools: {
                        ...prev.tools,
                        [key]: !checked,
                      },
                      ...(key === "OTHER" &&
                        checked && { other_description: "" }),
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
