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

import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySystems,
  AgencyTeamMemberRole,
  SupervisionSubsystems,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useStore } from "../../stores";
import logoImg from "../assets/jc-logo-vector-new.svg";
import { REPORTS_LOWERCASE } from "../Global/constants";
import { Logo, LogoContainer } from "../Header";
import { Loader } from "../Loading";
import {
  Button,
  DataUploadContainer,
  DataUploadHeader,
  DataUploadLoading,
  LoadingHeader,
  LoadingSubheader,
  SystemSelection,
  UploadFile,
} from ".";
import {
  DataUploadResponseBody,
  ErrorsWarningsMetrics,
  UploadedMetric,
} from "./types";
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
  uploaded_by_v2: {
    name: string;
    role: AgencyTeamMemberRole;
  };
  system: AgencySystems;
  status: UploadedFileStatus | null;
};

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
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const currentAgency = userStore.getAgency(agencyId);

  /**
   * Sub-systems of the SUPERVISION system should not render a separate template & instructions.
   *
   * Example: if an agency has the following systems ["SUPERVISION", "PAROLE", "PROBATION"],
   * the UI should render a template & instructions for the SUPERVISION system.
   */
  const userSystems = useMemo(() => {
    return currentAgency
      ? currentAgency.systems.filter(
          (system) => !SupervisionSubsystems.includes(system)
        )
      : [];
  }, [currentAgency]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorsWarningsMetrics, setErrorsWarningsMetrics] =
    useState<ErrorsWarningsMetrics>();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedSystem, setSelectedSystem] = useState<
    AgencySystems | undefined
  >();

  const handleFileUpload = async (
    file: File,
    system: AgencySystems
  ): Promise<void> => {
    if (file && system && agencyId) {
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      formData.append("system", system);
      formData.append("ingest_on_upload", "True");
      formData.append("agency_id", agencyId);

      const response = await reportStore.uploadExcelSpreadsheet(formData);

      if (response instanceof Error) {
        setIsLoading(false);
        return showToast({
          message: "Failed to upload. Please try again.",
          color: "red",
        });
      }

      /** Errors and/or Warnings Encountered During Upload -- Show Interstitial instead of Confirmation Page */
      const data: DataUploadResponseBody = await response?.json();

      const errorsWarningsAndMetrics = processUploadResponseBody(data);
      const hasErrorsOrWarnings =
        (errorsWarningsAndMetrics.nonMetricErrors &&
          errorsWarningsAndMetrics.nonMetricErrors.length > 0) ||
        errorsWarningsAndMetrics.errorsWarningsAndSuccessfulMetrics
          .errorWarningMetrics.length > 0 ||
        errorsWarningsAndMetrics.errorsWarningsAndSuccessfulMetrics.hasWarnings;

      setIsLoading(false);

      if (hasErrorsOrWarnings) {
        return setErrorsWarningsMetrics(errorsWarningsAndMetrics);
      }

      navigate("review-metrics", {
        state: { uploadedMetrics: data.metrics, fileName: file.name },
        replace: true,
      });
    }
  };

  const processUploadResponseBody = (
    data: DataUploadResponseBody
  ): ErrorsWarningsMetrics => {
    const errorsWarningsAndSuccessfulMetrics = data.metrics.reduce(
      (acc, metric) => {
        const noSheetErrorsFound =
          metric.metric_errors.filter(
            (sheet) =>
              sheet.messages.filter((msg) => msg.type === "ERROR")?.length > 0
          ).length === 0;
        const isSuccessfulMetric =
          noSheetErrorsFound && metric.datapoints.length > 0;

        /**
         * If there are no errors and only warnings, we still want to show the
         * error/warning page so users can review the warnings (that now appear in the success section).
         */
        metric.metric_errors.forEach((sheet) =>
          sheet.messages.forEach((msg) => {
            if (msg.type === "WARNING" && !acc.hasWarnings) {
              acc.hasWarnings = true;
            }
          })
        );

        if (isSuccessfulMetric) {
          acc.successfulMetrics.push(metric);
        } else {
          acc.errorWarningMetrics.push(metric);
        }

        return acc;
      },
      {
        successfulMetrics: [] as UploadedMetric[],
        errorWarningMetrics: [] as UploadedMetric[],
        hasWarnings: false,
      }
    );

    /**
     * Non-metric errors: errors that are not associated with a metric.
     * @example: user uploads an excel file that contains a sheet not associated
     * with a metric.
     */
    if (data.non_metric_errors && data.non_metric_errors.length > 0) {
      return {
        errorsWarningsAndSuccessfulMetrics,
        metrics: data.metrics,
        nonMetricErrors: data.non_metric_errors,
      };
    }

    return { errorsWarningsAndSuccessfulMetrics, metrics: data.metrics };
  };

  const handleSystemSelection = (file: File, system: AgencySystems) => {
    setIsLoading(true);
    setSelectedSystem(system);
    handleFileUpload(file, system);
    setSelectedFile(undefined);
  };

  const resetToNewUpload = () => {
    setErrorsWarningsMetrics(undefined);
    setSelectedFile(undefined);
    setSelectedSystem(userSystems.length === 1 ? userSystems[0] : undefined);
  };

  const renderCurrentUploadStep = (): JSX.Element => {
    /**
     * There are ~4 steps in the upload phase before reaching the metrics confirmation page.
     *
     * Step 1: Upload File
     * Trigger: no selected file and no upload error(s)/warnings(s) present in server response
     *
     * Step 2: System Selection (only for agencies with multiple systems)
     * Trigger: file selected AND no system selected
     *
     * Once a file and system have been selected, a loading page renders that will resolve into Step 3 or Step 4.
     *
     * Step 3: Upload Errors/Warnings
     * Trigger: upload error(s)/warnings(s) present in server response
     *
     * Step 4: Navigate to Confirmation Page
     * Trigger: file selected AND system selected AND no errors
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
    if (errorsWarningsMetrics) {
      return (
        <UploadErrorsWarnings
          errorsWarningsMetrics={errorsWarningsMetrics}
          selectedSystem={selectedSystem}
          resetToNewUpload={resetToNewUpload}
          fileName={selectedFile?.name}
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

  useEffect(() => {
    setSelectedSystem(userSystems.length === 1 ? userSystems[0] : undefined);
  }, [userSystems]);

  if (isLoading) {
    return (
      <DataUploadContainer>
        <DataUploadLoading>
          <Loader />
          <LoadingHeader>We are processing your data...</LoadingHeader>
          <LoadingSubheader>This might take a few minutes.</LoadingSubheader>
        </DataUploadLoading>
      </DataUploadContainer>
    );
  }

  return (
    <DataUploadContainer>
      <DataUploadHeader
        transparent={!selectedFile && !errorsWarningsMetrics}
        isBackgroundBlue={!selectedFile && !errorsWarningsMetrics}
      >
        <LogoContainer
          onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
        >
          <Logo src={logoImg} alt="" />
        </LogoContainer>

        <Button
          type={selectedFile || errorsWarningsMetrics ? "red" : "light-border"}
          onClick={() => navigate(-1)}
        >
          {selectedFile || errorsWarningsMetrics ? "Close" : "Cancel"}
        </Button>
      </DataUploadHeader>
      {renderCurrentUploadStep()}
    </DataUploadContainer>
  );
});
