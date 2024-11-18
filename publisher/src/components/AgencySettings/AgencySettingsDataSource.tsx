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
import { cloneDeep } from "lodash";
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
  DataSourceQuestionWrapper,
  DataSourceTitle,
  EditButtonContainer,
} from "./AgencySettings.styles";
import { AgencySettingsEditModeModal } from "./AgencySettingsEditModeModal";

const dataSourceMappingByType = {
  source: [
    {
      key: "CURRENT_AGENCY",
      label: "Data is collected directly by the agency",
    },
    {
      key: "OTHER_AGENCY_OR_SYSTEM",
      label: "Data is received from another agency or data system",
    },
    {
      key: "OTHER",
      label: "Other",
    },
    {
      key: "UNKNOWN",
      label: "Unknown",
    },
  ],
  modification: [
    {
      key: "YES",
      label: "Yes, data is verified or modified upon receipt",
    },
    {
      key: "NO",
      label: "No, data is stored unchanged",
    },
    {
      key: "OTHER",
      label: "Other",
    },
    {
      key: "UNKNOWN",
      label: "Unknown",
    },
  ],
  collection_method: [
    {
      key: "SELF_IDENTIFIED",
      label: "Self-identified",
    },
    {
      key: "STAFF_IDENTIFIED",
      label: "Observed or perceived by staff",
    },
    {
      key: "OTHER",
      label: "Other",
    },
    {
      key: "UNKNOWN",
      label: "Unknown",
    },
  ],
};

const emptyDataSourceSetting = {
  biological_sex: {
    source: {
      value: "",
      other_description: "",
    },
    modification: {
      value: "",
      other_description: "",
    },
    collection_method: {
      value: "",
      other_description: "",
    },
  },
  race_ethnicity: {
    source: {
      value: "",
      other_description: "",
    },
    modification: {
      value: "",
      other_description: "",
    },
    collection_method: {
      value: "",
      other_description: "",
    },
  },
};

type DataSourceSetting = {
  biological_sex: DataSourceSettingType;
  race_ethnicity: DataSourceSettingType;
};

type DataSourceSettingType = {
  source: DataSourceSettingValue;
  modification: DataSourceSettingValue;
  collection_method: DataSourceSettingValue;
};

type DataSourceSettingValue = {
  value: string;
  other_description: string;
};

const getSettingLabel = (
  settingType: keyof DataSourceSettingType,
  settingKey: string
) =>
  dataSourceMappingByType[settingType].find(
    (mapObj) => mapObj.key === settingKey
  )?.label;

const QuestionCheckboxBlock: React.FC<{
  question: string;
  setting: DataSourceSetting;
  sourceType: keyof DataSourceSetting;
  settingType: keyof DataSourceSettingType;
  settingKey: string;
  onChange: (setting: DataSourceSetting) => void;
}> = ({ question, setting, sourceType, settingType, settingKey, onChange }) => {
  const [currentKey, setCurrentKey] = useState(settingKey);
  const updatedSetting = { ...setting };

  const handleChange = (key: string) => {
    if (key !== "CURRENT_AGENCY") {
      updatedSetting[sourceType].collection_method.value = "";
    }
    if (key !== "OTHER_AGENCY_OR_SYSTEM") {
      updatedSetting[sourceType].modification.value = "";
    }
    updatedSetting[sourceType][settingType].value = key;
  };

  return (
    <>
      <DataSourceQuestionWrapper>{question}</DataSourceQuestionWrapper>
      <CheckboxOptions
        options={[
          ...Object.values(dataSourceMappingByType[settingType]).map(
            (mapObj) => {
              return {
                key: mapObj.key,
                label: mapObj.label,
                checked: currentKey === mapObj.key,
              };
            }
          ),
        ]}
        onChange={({ key }) => {
          setCurrentKey(key);
          handleChange(key);
          onChange(updatedSetting);
        }}
      />
    </>
  );
};

const AgencySettingsDataSource: React.FC<{
  settingProps: SettingProps;
}> = ({ settingProps }) => {
  const { isSettingInEditMode, openSetting, removeEditMode, allowEdit } =
    settingProps;

  const { agencyId } = useParams() as { agencyId: string };
  const { agencyStore } = useStore();
  const { currentAgencySettings, updateAgencySettings, saveAgencySettings } =
    agencyStore;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const dataSourceSetting = useMemo(() => {
    return (
      (currentAgencySettings?.find(
        (setting) =>
          setting.setting_type === "BIOLOGICAL_SEX_RACE_ETHNICITY_DATA_SOURCE"
      )?.value as DataSourceSetting) || {}
    );
  }, [currentAgencySettings]);

  const isSettingConfigured = Object.keys(dataSourceSetting).length > 0;

  const defaultSetting = isSettingConfigured
    ? cloneDeep(dataSourceSetting)
    : cloneDeep(emptyDataSourceSetting);

  const [updatedSetting, setUpdatedSetting] = useState(defaultSetting);

  useEffect(() => {
    setUpdatedSetting(defaultSetting);
    setBiologicalSexSource(defaultSetting.biological_sex.source.value);
    setRaceAndEthnicitySource(defaultSetting.race_ethnicity.source.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceSetting]);

  const [biologicalSexSource, setBiologicalSexSource] = useState(
    updatedSetting.biological_sex.source.value
  );
  const [raceAndEthnicitySource, setRaceAndEthnicitySource] = useState(
    updatedSetting.race_ethnicity.source.value
  );

  const handleSaveClick = () => {
    const updatedSettings = updateAgencySettings(
      "BIOLOGICAL_SEX_RACE_ETHNICITY_DATA_SOURCE",
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
    setBiologicalSexSource(defaultSetting.biological_sex.source.value);
    setRaceAndEthnicitySource(defaultSetting.race_ethnicity.source.value);
    setIsConfirmModalOpen(false);
    removeEditMode();
  };

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
            title="Biological Sex & Race and Ethnicity Data Source"
            description={
              <DataSourceContainer>
                {/* Biological Sex */}
                <DataSourceTitle>Biological Sex</DataSourceTitle>
                <QuestionCheckboxBlock
                  question="What is the source of biological sex data in your system?"
                  setting={updatedSetting}
                  sourceType="biological_sex"
                  settingType="source"
                  settingKey={updatedSetting.biological_sex.source.value}
                  onChange={(setting) => {
                    setUpdatedSetting(setting);
                    setBiologicalSexSource(setting.biological_sex.source.value);
                  }}
                />
                {biologicalSexSource === "OTHER_AGENCY_OR_SYSTEM" && (
                  <QuestionCheckboxBlock
                    question="Does your agency modify or amend biological sex data
                      received from another agency or data system?"
                    setting={updatedSetting}
                    sourceType="biological_sex"
                    settingType="modification"
                    settingKey={
                      updatedSetting.biological_sex.modification.value
                    }
                    onChange={(setting) => setUpdatedSetting(setting)}
                  />
                )}
                {biologicalSexSource === "CURRENT_AGENCY" && (
                  <QuestionCheckboxBlock
                    question="How is biological sex data collected?"
                    setting={updatedSetting}
                    sourceType="biological_sex"
                    settingType="collection_method"
                    settingKey={
                      updatedSetting.biological_sex.collection_method.value
                    }
                    onChange={(setting) => setUpdatedSetting(setting)}
                  />
                )}

                {/* Race and Ethnicity */}
                <DataSourceTitle>Race and Ethnicity</DataSourceTitle>
                <QuestionCheckboxBlock
                  question="What is the source of race and ethnicity data in your data
                  system?"
                  setting={updatedSetting}
                  sourceType="race_ethnicity"
                  settingType="source"
                  settingKey={updatedSetting.race_ethnicity.source.value}
                  onChange={(setting) => {
                    setUpdatedSetting(setting);
                    setRaceAndEthnicitySource(
                      setting.race_ethnicity.source.value
                    );
                  }}
                />
                {raceAndEthnicitySource === "OTHER_AGENCY_OR_SYSTEM" && (
                  <QuestionCheckboxBlock
                    question="Does your agency modify or amend race and ethnicity data
                      received from another agency or data system?"
                    setting={updatedSetting}
                    sourceType="race_ethnicity"
                    settingType="modification"
                    settingKey={
                      updatedSetting.race_ethnicity.modification.value
                    }
                    onChange={(setting) => setUpdatedSetting(setting)}
                  />
                )}
                {raceAndEthnicitySource === "CURRENT_AGENCY" && (
                  <QuestionCheckboxBlock
                    question="How are race and ethnicity data collected?"
                    setting={updatedSetting}
                    sourceType="race_ethnicity"
                    settingType="collection_method"
                    settingKey={
                      updatedSetting.race_ethnicity.collection_method.value
                    }
                    onChange={(setting) => setUpdatedSetting(setting)}
                  />
                )}
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
            modalBackground="opaque"
            onClickClose={handleCancelClick}
            agencySettingsConfigs
            jurisdictionsSettingsConfigs
            agencySettingsAndJurisdictionsTitleConfigs
            customPadding="4px 40px 24px 40px"
          />
        </AgencySettingsEditModeModal>
      )}

      <AgencySettingsBlock withBorder id="data_source">
        <BasicInfoBlockTitle configured={isSettingConfigured}>
          Biological Sex & Race and Ethnicity Data Source
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
          Describe the data source of biological sex and race and ethnicity data
        </AgencyInfoBlockDescription>

        {isSettingConfigured && (
          <>
            {biologicalSexSource && (
              <>
                <BasicInfoBlockTitle withPadding>
                  Biological Sex Data Source
                </BasicInfoBlockTitle>
                <AgencyInfoBlockDescription>
                  {getSettingLabel("source", biologicalSexSource)}
                </AgencyInfoBlockDescription>
                <AgencyInfoBlockDescription>
                  {getSettingLabel(
                    "collection_method",
                    updatedSetting.biological_sex.collection_method.value
                  ) ||
                    getSettingLabel(
                      "modification",
                      updatedSetting.biological_sex.modification.value
                    )}
                </AgencyInfoBlockDescription>
              </>
            )}
            {raceAndEthnicitySource && (
              <>
                <BasicInfoBlockTitle withPadding>
                  Race and Ethnicity Data Source
                </BasicInfoBlockTitle>
                <AgencyInfoBlockDescription>
                  {getSettingLabel("source", raceAndEthnicitySource)}
                </AgencyInfoBlockDescription>
                <AgencyInfoBlockDescription>
                  {getSettingLabel(
                    "collection_method",
                    updatedSetting.race_ethnicity.collection_method.value
                  ) ||
                    getSettingLabel(
                      "modification",
                      updatedSetting.race_ethnicity.modification.value
                    )}
                </AgencyInfoBlockDescription>
              </>
            )}
          </>
        )}
      </AgencySettingsBlock>
    </>
  );
};

export default observer(AgencySettingsDataSource);
