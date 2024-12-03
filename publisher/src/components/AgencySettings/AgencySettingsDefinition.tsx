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
    included: IncludedValue;
  }[];
};

const getDefaultSetting = (
  systems: AgencySystemKeys[],
  defaultIncluded?: IncludedValue
): AgencyDefinitionSetting[] => {
  if (!systems.length) return [];

  return systems.map((system) => {
    return {
      sector: system,
      settings: Object.entries(AgencyIncludesExcludes[system]).map(
        ([key, obj]) => {
          return {
            key,
            included: defaultIncluded ?? obj.default,
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

  const isSupervisionAgency =
    currentAgencySystems?.includes(AgencySystems.SUPERVISION) &&
    currentAgencySystems?.some((system) =>
      SupervisionSubsystems.includes(system)
    );
  const isCourtAgency = currentAgencySystems?.includes(
    AgencySystems.COURTS_AND_PRETRIAL
  );
  const isCombinedAgency = isSupervisionAgency && isCourtAgency;

  const discreteAgencyTitle = isSupervisionAgency ? "Supervision" : "Court";
  const agencyTitle = isCombinedAgency ? "Combined" : discreteAgencyTitle;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentSystems, setCurrentSystems] = useState<AgencySystemKeys[]>([]);
  const [descriptionValue, setDescriptionValue] = useState("");

  const agencyDefinitionSetting = useMemo(() => {
    return (
      (currentAgencySettings?.find(
        (setting) => setting.setting_type === "SECTOR_INCLUDES_EXCLUDES"
      )?.value as AgencyDefinitionSetting[]) || []
    );
  }, [currentAgencySettings]);

  const isSettingConfigured = agencyDefinitionSetting.length > 0;

  useEffect(() => {
    setCurrentSystems([]);

    if (isCombinedAgency) {
      setCurrentSystems([
        ...((currentAgencySystems?.filter((system) =>
          SupervisionSubsystems.includes(system)
        ) as AgencySystemKeys[]) || []),
        AgencySystems.COURTS_AND_PRETRIAL,
      ]);
    } else {
      if (isSupervisionAgency)
        setCurrentSystems(
          (currentAgencySystems?.filter((system) =>
            SupervisionSubsystems.includes(system)
          ) as AgencySystemKeys[]) || []
        );
      if (isCourtAgency) setCurrentSystems([AgencySystems.COURTS_AND_PRETRIAL]);
    }
  }, [
    currentAgencySystems,
    isCourtAgency,
    isSupervisionAgency,
    isCombinedAgency,
  ]);

  const defaultSetting = isSettingConfigured
    ? agencyDefinitionSetting
    : getDefaultSetting(currentSystems, IncludesExcludesEnum.NO);

  const [updatedSetting, setUpdatedSetting] = useState(defaultSetting);

  useEffect(() => {
    setUpdatedSetting(defaultSetting);
    setDescriptionValue("");
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
                  return (
                    <React.Fragment key={system}>
                      {isSupervisionAgency && (
                        <DataSourceTitle>
                          {removeSnakeCase(system).toLocaleLowerCase()}
                        </DataSourceTitle>
                      )}
                      <CheckboxOptions
                        options={[
                          ...Object.entries(AgencyIncludesExcludes[system]).map(
                            ([key, mapObj]) => {
                              const included = updatedSetting
                                .find((sector) => sector.sector === system)
                                ?.settings.find(
                                  (setting) => setting.key === key
                                )?.included;

                              return {
                                key,
                                label: mapObj.label,
                                checked: included === IncludesExcludesEnum.YES,
                              };
                            }
                          ),
                        ]}
                        onChange={({ key, checked }) => {
                          setUpdatedSetting((prevSettings) => {
                            const updates = prevSettings.map((sector) => {
                              if (sector.sector === system) {
                                return {
                                  ...sector,
                                  settings: sector.settings.map((setting) =>
                                    setting.key === key
                                      ? {
                                          ...setting,
                                          included: boolToYesNoEnum(!checked),
                                        }
                                      : setting
                                  ),
                                };
                              }
                              return sector;
                            });

                            return updates;
                          });
                        }}
                      />
                    </React.Fragment>
                  );
                })}
                <NewInput
                  name="agency_definition_description"
                  id="agency_definition_description"
                  type="text"
                  multiline
                  placeholder="If the listed categories do not adequately describe your breakdown, please describe additional data elements included in your agency’s definition."
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.target.value)}
                  fullWidth
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
            maxHeight={900}
            modalBackground="opaque"
            onClickClose={handleCancelClick}
            agencySettingsConfigs
            jurisdictionsSettingsConfigs
            agencySettingsAndJurisdictionsTitleConfigs
            customPadding="4px 40px 24px 40px"
          />
        </AgencySettingsEditModeModal>
      )}

      <AgencySettingsBlock withBorder id="agency_definition">
        <BasicInfoBlockTitle configured={isSettingConfigured}>
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
