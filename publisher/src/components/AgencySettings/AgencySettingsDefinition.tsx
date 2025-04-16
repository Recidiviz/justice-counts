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
import { NewInput } from "@justice-counts/common/components/Input";
import { Modal } from "@justice-counts/common/components/Modal";
import {
  AgencySystems,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { ChooseDefaultSettings } from "../MetricsConfiguration/ModalForm.styled";
import { SettingProps } from "./AgencySettings";
import {
  AgencyInfoBlockDescription,
  AgencySettingsBlock,
  BasicInfoBlockTitle,
  DataSourceContainer,
  DataSourceQuestionWrapper,
  DataSourceTitle,
  DefinitionDescriptionInputWrapper,
  EditButtonContainer,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";
import {
  AgencyIncludesExcludes,
  boolToYesNoEnum,
} from "./IncludesExcludes/includesExcludes";
import {
  AgencySystemKeys,
  IncludesExcludesEnum,
} from "./IncludesExcludes/types";

type IncludedValue = `${IncludesExcludesEnum}`;

type AgencyDefinitionSetting = {
  sector: AgencySystemKeys;
  settings: {
    key: string;
    included?: IncludedValue;
    value?: string;
  }[];
};

const getDefaultSetting = (
  systems: AgencySystemKeys[],
  unconfiguredDefault?: IncludedValue
): AgencyDefinitionSetting[] => {
  if (!systems.length) return [];

  return systems.map((system) => {
    return {
      sector: system,
      settings: Object.entries(AgencyIncludesExcludes[system]).map(
        ([key, obj]) => {
          return {
            key,
            included: unconfiguredDefault ?? obj.default,
          };
        }
      ),
    };
  });
};

const AgencySettingsDefinition: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore } = useStore();
  const {
    currentAgencySystems,
    currentAgencySettings,
    updateAgencySettings,
    saveAgencySettings,
  } = agencyStore;

  const isSupervisionAgencyWithEnabledSubpopulations =
    currentAgencySystems?.includes(AgencySystems.SUPERVISION) &&
    currentAgencySystems?.some((system) =>
      SupervisionSubsystems.includes(system)
    );
  const isCourtAgency = currentAgencySystems?.includes(
    AgencySystems.COURTS_AND_PRETRIAL
  );
  const isCombinedAgency =
    isSupervisionAgencyWithEnabledSubpopulations && isCourtAgency;

  const discreteAgencyTitle = isSupervisionAgencyWithEnabledSubpopulations
    ? "Supervision"
    : "Court";
  const agencyTitle = isCombinedAgency ? "Combined" : discreteAgencyTitle;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentSystems, setCurrentSystems] = useState<AgencySystemKeys[]>([]);

  const agencyDefinitionSetting = useMemo(() => {
    return (
      (currentAgencySettings?.find(
        (setting) => setting.setting_type === "SECTOR_INCLUDES_EXCLUDES"
      )?.value as AgencyDefinitionSetting[]) || []
    );
  }, [currentAgencySettings]);

  useEffect(() => {
    // When we select agency without applicable sectors we need to reset currentSystems, otherwise it can have values from previous agencies in it.
    // We also can't do it in reset effect below, because it depends on currentSystems and it'll cause infinite loop.
    setCurrentSystems([]);

    const supervisionSystems =
      (currentAgencySystems?.filter((system) =>
        SupervisionSubsystems.includes(system)
      ) as AgencySystemKeys[]) || [];

    if (isCombinedAgency) {
      setCurrentSystems([
        ...supervisionSystems,
        AgencySystems.COURTS_AND_PRETRIAL,
      ]);
    } else {
      if (isSupervisionAgencyWithEnabledSubpopulations)
        setCurrentSystems(supervisionSystems);
      if (isCourtAgency) setCurrentSystems([AgencySystems.COURTS_AND_PRETRIAL]);
    }
  }, [
    currentAgencySystems,
    isCourtAgency,
    isSupervisionAgencyWithEnabledSubpopulations,
    isCombinedAgency,
  ]);

  const configuredSystems = agencyDefinitionSetting.map(
    (setting) => setting.sector
  );
  const unconfiguredSystems = currentSystems.filter(
    (sector) => !configuredSystems.includes(sector)
  );

  const initialSetting = [
    ...agencyDefinitionSetting,
    ...getDefaultSetting(unconfiguredSystems, IncludesExcludesEnum.NO),
  ];

  const [updatedSetting, setUpdatedSetting] = useState(initialSetting);

  // This is a reset effect and it's used to reset setting for UI to work properly.
  // The absence of this effect causes visual bug where setting from the previous agency may be displayed.
  useEffect(() => {
    setUpdatedSetting(initialSetting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyDefinitionSetting, currentSystems]);

  const handleSaveClick = () => {
    const updatedSettings = updateAgencySettings(
      "SECTOR_INCLUDES_EXCLUDES",
      updatedSetting,
      parseInt(agencyId)
    );
    saveAgencySettings(updatedSettings, agencyId);
    removeEditMode();
  };

  const handleCancelClick = () => {
    if (JSON.stringify(updatedSetting) === JSON.stringify(initialSetting)) {
      removeEditMode();
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const handleCancelModalConfirm = () => {
    setUpdatedSetting(initialSetting);
    setIsConfirmModalOpen(false);
    removeEditMode();
  };

  const handleCheckboxChange = (
    key: string,
    checked: boolean,
    system: AgencySystemKeys
  ) => {
    setUpdatedSetting((prevSettings) => {
      const updates = prevSettings.map((prevSetting) => {
        if (prevSetting.sector === system) {
          return {
            ...prevSetting,
            settings: prevSetting.settings.map((setting) =>
              setting.key === key
                ? {
                    ...setting,
                    included: boolToYesNoEnum(!checked),
                  }
                : setting
            ),
          };
        }
        return prevSetting;
      });

      return updates;
    });
  };

  const handleDescriptionChange = (system: AgencySystemKeys, value: string) => {
    setUpdatedSetting((prevSettings) => {
      return prevSettings.map((prevSetting) => {
        if (prevSetting.sector === system) {
          return {
            ...prevSetting,
            settings: [
              ...prevSetting.settings.filter(
                (setting) => setting.key !== "ADDITIONAL_CONTEXT"
              ), // Ensure no duplicate keys
              {
                key: "ADDITIONAL_CONTEXT",
                value,
              },
            ],
          };
        }
        return prevSetting;
      });
    });
  };

  if (!currentSystems.length) return null;

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
            title={`${agencyTitle} Agency Definition`}
            description={
              <DataSourceContainer>
                <DataSourceQuestionWrapper>
                  Indicate which of the following categories best defines your
                  agency. Or, choose the{" "}
                  <ChooseDefaultSettings
                    onClick={() =>
                      setUpdatedSetting(getDefaultSetting(currentSystems))
                    }
                  >
                    Justice Counts definition.
                  </ChooseDefaultSettings>
                </DataSourceQuestionWrapper>

                {currentSystems?.map((system) => {
                  const defaultDescription = initialSetting
                    .find((setting) => setting.sector === system)
                    ?.settings.find(
                      (setting) => setting.key === "ADDITIONAL_CONTEXT"
                    )?.value;

                  return (
                    <React.Fragment key={system}>
                      {isSupervisionAgencyWithEnabledSubpopulations && (
                        <DataSourceTitle>
                          {removeSnakeCase(system).toLocaleLowerCase()}
                        </DataSourceTitle>
                      )}
                      <CheckboxOptions
                        options={[
                          ...Object.entries(AgencyIncludesExcludes[system]).map(
                            ([key, option]) => {
                              const included = updatedSetting
                                .find((sector) => sector.sector === system)
                                ?.settings.find(
                                  (setting) => setting.key === key
                                )?.included;

                              return {
                                key,
                                label: option.label,
                                checked: included === IncludesExcludesEnum.YES,
                              };
                            }
                          ),
                        ]}
                        onChange={({ key, checked }) =>
                          handleCheckboxChange(key, checked, system)
                        }
                      />
                      <DefinitionDescriptionInputWrapper>
                        <NewInput
                          name={`${system.toLocaleLowerCase()}_description`}
                          id={`${system.toLocaleLowerCase()}_description`}
                          type="text"
                          multiline
                          placeholder="If the listed categories do not adequately describe your agency, please describe additional data elements included in your agency’s definition."
                          defaultValue={defaultDescription}
                          onChange={(e) =>
                            handleDescriptionChange(system, e.target.value)
                          }
                          fullWidth
                        />
                      </DefinitionDescriptionInputWrapper>
                    </React.Fragment>
                  );
                })}
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

      <AgencySettingsBlock withBorder id="agency_definition">
        <BasicInfoBlockTitle>
          {agencyTitle} Agency Definition
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
          Information about how your agency is defined
        </AgencyInfoBlockDescription>
      </AgencySettingsBlock>
    </>
  );
};

export default observer(AgencySettingsDefinition);
