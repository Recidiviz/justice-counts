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

import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AgencySystems } from "../../shared/types";
import { useStore } from "../../stores";
import logoImg from "../assets/jc-logo-vector.png";
import { Logo, LogoContainer } from "../Header";
import { Loading } from "../Loading";
import { showToast } from "../Toast";
import {
  Button,
  DataUploadContainer,
  DataUploadHeader,
  SystemSelection,
  UploadFile,
} from ".";
import { UploadErrorsWarnings } from "./UploadErrorsWarnings";

export type UploadedFileStatus = "UPLOADED" | "INGESTED" | "ERRORED";

export type UploadedFileAttempt = {
  name: string;
  upload_attempt_timestamp: number;
  status?: "ERRORED";
};

export type UploadedFile = {
  name: string;
  id: number;
  uploaded_at: number;
  ingested_at: number;
  uploaded_by: string;
  system: AgencySystems;
  status: UploadedFileStatus | null;
};

export type ErrorWarningMessage = {
  title: string;
  subtitle: string;
  description: string;
  type: "ERROR" | "WARNING";
};

export type MetricErrors = {
  display_name: string;
  sheet_name: string;
  messages: ErrorWarningMessage[];
};

export type MetricErrorsWarnings = {
  errorCount: number;
  warningCount: number;
  metricErrors: MetricErrors[];
};

export type PreIngestErrors = {
  errorCount: number;
  messages: ErrorWarningMessage[];
};

/**
 * The systems in EXCLUDED_SYSTEMS are sub-systems of the SUPERVISION system,
 * and should not render a separate template & instructions.
 *
 * Example: if an agency has the following systems ["SUPERVISION", "PAROLE", "PROBATION"],
 * the UI should render a template & instructions for the SUPERVISION system.
 */
export const EXCLUDED_SYSTEMS = ["PAROLE", "PROBATION", "POST_RELEASE"];

export const systemToTemplateSpreadsheetFileName: { [system: string]: string } =
  {
    LAW_ENFORCEMENT: "LAW_ENFORCEMENT.xlsx",
    PROSECUTION: "PROSECUTION.xlsx",
    DEFENSE: "DEFENSE.xlsx",
    COURTS_AND_PRETRIAL: "COURTS_AND_PRETRIAL.xlsx",
    JAILS: "JAILS.xlsx",
    PRISONS: "PRISONS.xlsx",
    SUPERVISION: "SUPERVISION.xlsx",
    PAROLE: "SUPERVISION.xlsx",
    PROBATION: "SUPERVISION.xlsx",
  };

export const DataUpload: React.FC = observer(() => {
  const { userStore, reportStore } = useStore();
  const navigate = useNavigate();
  const userSystems =
    userStore.currentAgency?.systems.filter(
      (system) => !EXCLUDED_SYSTEMS.includes(system)
    ) || [];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorsAndWarnings, setErrorsAndWarnings] = useState<
    MetricErrorsWarnings | PreIngestErrors
  >();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedSystem, setSelectedSystem] = useState<
    AgencySystems | undefined
  >(userSystems.length === 1 ? userSystems[0] : undefined);

  const handleFileUpload = async (
    file: File,
    system: AgencySystems
  ): Promise<void> => {
    if (file && system && userStore.currentAgencyId) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("system", system);
      formData.append("ingest_on_upload", "True");
      formData.append("agency_id", userStore.currentAgencyId.toString());

      const response = await reportStore.uploadExcelSpreadsheet(formData);

      if (response instanceof Error) {
        setIsLoading(false);
        return showToast("Failed to upload. Please try again.", false, "red");
      }

      const data = await response?.json();
      const mockData = JSON.parse(`{
        "metrics": [
          {
            "datapoints": [],
            "display_name": "Total Arrests",
            "key": "LAW_ENFORCEMENT_ARRESTS_global/gender/restricted,global/race_and_ethnicity,metric/law_enforcement/reported_crime/type",
            "sheets": [
              {
                "display_name": "Arrests",
                "messages": [
                  {
                    "description": "There should only be a single row containing data for arrests in 6/2021.",
                    "subtitle": "6/2021",
                    "title": "Too Many Rows",
                    "type": "WARNING"
                  }
                ],
                "sheet_name": "arrests"
              },
              {
                "display_name": "Arrests By Race",
                "messages": [
                  {
                    "description": "We expected the following column race/ethnicity to be found in the sheet arrests_by_race. Only the following rows were found in the sheet: ['year', 'month', 'value'].",
                    "subtitle": "race/ethnicity",
                    "title": "Missing Column",
                    "type": "WARNING"
                  },
                  {
                    "description": "We expected the following column race/ethnicity to be found in the sheet arrests_by_race. Only the following rows were found in the sheet: ['year', 'month', 'value'].",
                    "subtitle": "race/ethnicity",
                    "title": "Missing Column",
                    "type": "WARNING"
                  },
                  {
                    "description": "We expected the following column race/ethnicity to be found in the sheet arrests_by_race. Only the following rows were found in the sheet: ['year', 'month', 'value'].",
                    "subtitle": "race/ethnicity",
                    "title": "Missing Column",
                    "type": "WARNING"
                  }
                ],
                "sheet_name": "arrests_by_race"
              }
            ]
          },
          {
            "datapoints": [],
            "display_name": "Different Metric",
            "key": "LAW_ENFORCEMENT_ARRESTS_global/gender/restricted,global/race_and_ethnicity,metric/law_enforcement/reported_crime/type",
            "sheets": [
              {
                "display_name": "Different Metric Arrests",
                "messages": [
                  {
                    "description": "There should only be a single row containing data for arrests in 6/2021.",
                    "subtitle": "6/2021",
                    "title": "Too Many Rows",
                    "type": "WARNING"
                  }
                ],
                "sheet_name": "arrests"
              },
              {
                "display_name": "Different Metric Arrests By Race",
                "messages": [
                  {
                    "description": "We expected the following column race/ethnicity to be found in the sheet arrests_by_race. Only the following rows were found in the sheet: ['year', 'month', 'value'].",
                    "subtitle": "race/ethnicity",
                    "title": "Missing Column",
                    "type": "WARNING"
                  },
                  {
                    "description": "We expected the following column race/ethnicity to be found in the sheet arrests_by_race. Only the following rows were found in the sheet: ['year', 'month', 'value'].",
                    "subtitle": "race/ethnicity",
                    "title": "Missing Column",
                    "type": "WARNING"
                  }
                ],
                "sheet_name": "arrests_by_race"
              }
            ]
          }
        ],
        "upload_errors": []
      }`);

      /** Handle Pre-Ingest Errors and Metric Errors */
      const errors = handleUploadErrors(
        data.metrics,
        data.upload_errors?.length ? data.upload_errors : undefined
      );
      setIsLoading(false);

      if (
        errors.errorCount ||
        ("warningCount" in errors && errors.warningCount)
      ) {
        return setErrorsAndWarnings(errors);
      }

      /** Successful Upload - Proceed To Confirmation Page */
      /** (TODO(#15195): Placeholder - toast will be removed and this should navigate to the confirmation component */

      showToast(
        "File uploaded successfully and is pending processing by a Justice Counts administrator.",
        true,
        undefined,
        3500
      );
      // navigate("/");
    }
  };

  const handleUploadErrors = (
    metrics: {
      datapoints: [];
      display_name: string;
      key: string;
      sheets: MetricErrors[];
      upload_errors: PreIngestErrors["messages"];
    }[],
    preIngestErrorMessages?: PreIngestErrors["messages"]
  ): MetricErrorsWarnings | PreIngestErrors => {
    if (preIngestErrorMessages) {
      return {
        errorCount: preIngestErrorMessages.length,
        messages: preIngestErrorMessages,
      };
    }

    const metricErrors = metrics.reduce(
      (acc, metric) => [...acc, ...metric.sheets],
      [] as MetricErrors[]
    );
    const errorWarningCount = metricErrors.reduce(
      (acc, sheet) => {
        sheet.messages.forEach((msg) => {
          if (msg.type === "ERROR") acc.errorCount += 1;
          if (msg.type === "WARNING") acc.warningCount += 1;
        });
        return acc;
      },
      {
        errorCount: 0,
        warningCount: 0,
      }
    );

    return { metricErrors, ...errorWarningCount };
  };

  const handleSystemSelection = (file: File, system: AgencySystems) => {
    setIsLoading(true);
    setSelectedSystem(system);
    handleFileUpload(file, system);
    setSelectedFile(undefined);
  };

  const resetToNewUpload = () => {
    setErrorsAndWarnings(undefined);
    setSelectedFile(undefined);
    setSelectedSystem(userSystems.length === 1 ? userSystems[0] : undefined);
  };

  if (isLoading) {
    return (
      <DataUploadContainer>
        <Loading />
      </DataUploadContainer>
    );
  }

  const renderCurrentUploadStep = (): JSX.Element => {
    /**
     * There are ~3 steps in the upload phase before reaching the metrics confirmation page.
     *
     * Step 1: Upload File
     * Trigger: no selected file and no upload error(s)/warnings(s) present in server response
     *
     * Step 2: System Selection (only for agencies with multiple systems)
     * Trigger: file selected AND no system selected
     *
     * Step 3: Upload Errors/Warnings
     * Trigger: upload error(s)/warnings(s) present in server response
     */

    if (selectedFile && !selectedSystem) {
      /** System Selection Step (for multi-system users) */
      return (
        <SystemSelection
          selectedFile={selectedFile}
          userSystems={userSystems}
          handleSystemSelection={handleSystemSelection}
        />
      );
    }

    /** Upload Error/Warnings Step */
    if (errorsAndWarnings) {
      return (
        <UploadErrorsWarnings
          errorsAndWarnings={errorsAndWarnings}
          selectedSystem={selectedSystem}
          resetToNewUpload={resetToNewUpload}
        />
      );
    }

    /** Upload File Step */
    return (
      <UploadFile
        userSystems={userSystems}
        setIsLoading={setIsLoading}
        setSelectedFile={setSelectedFile}
        handleFileUpload={handleFileUpload}
      />
    );
  };

  return (
    <DataUploadContainer>
      <DataUploadHeader transparent={!selectedFile && !errorsAndWarnings}>
        <LogoContainer onClick={() => navigate("/")}>
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <Button
          type={selectedFile || errorsAndWarnings ? "red" : "light-border"}
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </DataUploadHeader>

      {renderCurrentUploadStep()}
    </DataUploadContainer>
  );
});
