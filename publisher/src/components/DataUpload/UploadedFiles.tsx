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

import {
  Badge,
  BadgeColorMapping,
  BadgeColors,
} from "@justice-counts/common/components/Badge";
import { Button } from "@justice-counts/common/components/Button";
import { Modal } from "@justice-counts/common/components/Modal";
import { showToast } from "@justice-counts/common/components/Toast";
import {
  AgencySystem,
  AgencyTeamMemberRole,
} from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { formatSystemName } from "../../utils";
import { SYSTEM_CAPITALIZED } from "../Global/constants";
import { ContainedLoader } from "../Loading";
import { ResourceTypes, UnauthorizedDeleteActionModal } from "../Modals";
import { TeamMemberNameWithBadge } from "../primitives";
import { UploadedFile, UploadedFileStatus } from ".";
import {
  ActionsContainer,
  DateUploaded,
  ExtendedLabelCell,
  ExtendedLabelRow,
  ExtendedRow,
  UploadedContainer,
  UploadedFilesCell,
  UploadedFilesContainer,
  UploadedFilesError,
  UploadedFilesTable,
  UploadedFilesTitle,
  UploadedFilesWrapper,
} from "./UploadedFiles.styles";

export const UploadedFileRow: React.FC<{
  fileRowDetails: {
    key: string;
    id?: number;
    selected: boolean;
    name: string;
    badgeColor: BadgeColors;
    badgeText: string;
    dateUploaded: string;
    dateIngested: string;
    system?: AgencySystem;
    uploadedByName: string;
    uploadedByRole: AgencyTeamMemberRole;
    sharedDatapointsCount: number | string;
  };
  deleteUploadedFile: (spreadsheetID: number) => void;
  updateUploadedFileStatus: (
    spreadsheetID: number,
    status: UploadedFileStatus
  ) => Promise<void>;
  setIsUnauthorizedRemoveFileModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}> = observer(
  ({
    fileRowDetails,
    deleteUploadedFile,
    updateUploadedFileStatus,
    setIsUnauthorizedRemoveFileModalOpen,
  }) => {
    const { reportStore, userStore } = useStore();
    const [isDownloading, setIsDownloading] = useState(false);
    const [rowHovered, setRowHovered] = useState(false);
    const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
      useState(false);
    const { agencyId } = useParams() as { agencyId: string };

    const isReadOnly = userStore.isUserReadOnly(agencyId);
    const isJCAdmin = userStore.isJusticeCountsAdmin(agencyId);

    const handleDownload = async (spreadsheetID: number, name: string) => {
      setIsDownloading(true);

      const response = await reportStore.fetchSpreadsheetBlob(spreadsheetID);

      if (response instanceof Error) {
        setIsDownloading(false);
        return showToast({
          message: "Failed to download. Please try again.",
          color: "red",
        });
      }

      const data = await response?.blob();

      if (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
        });

        const link = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = name;
        link.click();

        window.URL.revokeObjectURL(url);
        link.remove();
        setIsDownloading(false);
      }
    };

    const {
      id,
      selected,
      name,
      badgeColor,
      badgeText,
      dateUploaded,
      dateIngested,
      system,
      uploadedByName,
      uploadedByRole,
      sharedDatapointsCount,
    } = fileRowDetails;

    useEffect(
      () => {
        if (rowHovered) setRowHovered(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [fileRowDetails]
    );

    return (
      <>
        {isDeleteConfirmationModalOpen && (
          <Modal
            title="Data from deleted file will still exist in records"
            description="Deleting this file will only remove it from the list of uploaded files. In order to remove data from the Justice Counts dashboard and publisher, you must delete the data directly within records."
            buttons={[
              {
                label: "Cancel",
                onClick: () => setIsDeleteConfirmationModalOpen(false),
              },
              {
                label: "Confirm",
                onClick: () => id && deleteUploadedFile(id),
              },
            ]}
            customPadding="32px"
          />
        )}

        <ExtendedRow
          selected={selected}
          onClick={() => id && handleDownload(id, name)}
          onMouseOver={() => setRowHovered(true)}
          onMouseLeave={() => setRowHovered(false)}
        >
          {/* Filename */}
          <UploadedFilesCell>
            <span>{name}</span>
            <Badge color={badgeColor} loading={badgeText === "Uploading"}>
              {badgeText}
            </Badge>
            {((rowHovered && id) || isDownloading) && (
              <Badge color="GREEN" loading={isDownloading}>
                {isDownloading ? "Downloading" : "Download"}
              </Badge>
            )}
          </UploadedFilesCell>

          {/* Date Uploaded */}
          <UploadedFilesCell capitalize>
            <UploadedContainer>
              {/* TODO(#334) Hook up admin badges rendering to team member roles API */}
              <TeamMemberNameWithBadge
                name={uploadedByName}
                badgeId={id?.toString()}
                role={uploadedByRole}
              />
              <DateUploaded>{`/ ${dateUploaded}`}</DateUploaded>
            </UploadedContainer>
          </UploadedFilesCell>

          {/* Date Ingested */}
          <UploadedFilesCell capitalize>
            <span>{dateIngested}</span>
          </UploadedFilesCell>

          {/* Datapoints Shared */}
          <UploadedFilesCell>
            <span>{sharedDatapointsCount}</span>
          </UploadedFilesCell>

          {/* System */}
          <UploadedFilesCell capitalize>
            <span>{system}</span>
          </UploadedFilesCell>

          {rowHovered && id && (
            <ActionsContainer onClick={(e) => e.stopPropagation()}>
              {!isReadOnly && (
                <Button
                  label="Delete"
                  onClick={() => {
                    if (!isJCAdmin) {
                      setIsUnauthorizedRemoveFileModalOpen(true);
                    } else if (!isDeleteConfirmationModalOpen) {
                      setIsDeleteConfirmationModalOpen(true);
                    }
                  }}
                  buttonColor="red"
                />
              )}
            </ActionsContainer>
          )}
        </ExtendedRow>
      </>
    );
  }
);

export const UploadedFiles: React.FC = observer(() => {
  const { agencyId } = useParams() as { agencyId: string };
  const { reportStore, userStore } = useStore();
  const currentAgency = userStore.getAgency(agencyId);
  const dataUploadColumnTitles = [
    "Filename",
    "Uploaded",
    "Processed",
    "Datapoints Shared",
    SYSTEM_CAPITALIZED,
  ];

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [
    isUnauthorizedRemoveRecordsModalOpen,
    setIsUnauthorizedRemoveFileModalOpen,
  ] = useState(false);

  const uploadStatusColorMapping: BadgeColorMapping = {
    UPLOADED: "ORANGE",
    INGESTED: "GREEN",
    ERRORED: "RED",
  };

  const translateBackendFileStatus = (status: UploadedFileStatus): string => {
    if (status === "UPLOADED") return "PENDING";
    if (status === "INGESTED") return "PROCESSED";
    if (status === "ERRORED") return "ERROR";
    return status;
  };

  const getFileRowDetails = (file: UploadedFile) => {
    const fileStatus = file.status && translateBackendFileStatus(file.status);

    const formatDate = (timestamp: number) =>
      Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(timestamp);

    return {
      key: `${file.name}-${file.id}`,
      id: file.id,
      selected: !file.status,
      name: file.name,
      badgeColor: file.status
        ? uploadStatusColorMapping[file.status]
        : "ORANGE",
      badgeText: fileStatus?.toLowerCase() || "Uploading",
      dateUploaded: formatDate(file.uploaded_at),
      dateIngested: file.ingested_at ? formatDate(file.ingested_at) : "--",
      system: formatSystemName(file.system, {
        allUserSystems: currentAgency?.systems,
        hideCombined: true,
      }) as AgencySystem,
      uploadedByName: file.uploaded_by_v2.name,
      uploadedByRole: file.uploaded_by_v2.role,
      sharedDatapointsCount: file.num_new_datapoints ?? "--",
    };
  };

  const deleteUploadedFile = useCallback(async (spreadsheetID: number) => {
    const response = await reportStore.deleteUploadedSpreadsheet(spreadsheetID);

    if (response instanceof Error) {
      return showToast({ message: response.message, color: "red" });
    }

    return setUploadedFiles((prev) => {
      const filteredFiles = prev.filter((file) => file.id !== spreadsheetID);

      return filteredFiles;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUploadedFileStatus = useCallback(
    async (spreadsheetID: number, status: UploadedFileStatus) => {
      const response = await reportStore.updateFileStatus(
        spreadsheetID,
        status
      );

      if (response instanceof Error) {
        return showToast({ message: response.message, color: "red" });
      }

      return fetchListOfUploadedFiles();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchListOfUploadedFiles = async () => {
    const response = (await reportStore.getUploadedFilesList(agencyId)) as
      | Response
      | Error;

    setIsLoading(false);

    if (response instanceof Error) {
      return setFetchError(true);
    }

    setFetchError(false);

    const listOfFiles = (await response.json()) as UploadedFile[];
    setUploadedFiles(listOfFiles);
  };

  useEffect(
    () => {
      fetchListOfUploadedFiles();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [agencyId]
  );

  if (isLoading) {
    return <ContainedLoader />;
  }

  if (fetchError) {
    return (
      <UploadedFilesError>
        Failed to retrieve uploaded files. Please refresh and try again.
      </UploadedFilesError>
    );
  }

  return (
    <UploadedFilesWrapper>
      {isUnauthorizedRemoveRecordsModalOpen && (
        <UnauthorizedDeleteActionModal
          closeModal={() => setIsUnauthorizedRemoveFileModalOpen(false)}
          resourceType={ResourceTypes.FILE}
        />
      )}

      <UploadedFilesTitle />

      <UploadedFilesContainer>
        {/* <ExtendedLabelRow> */}
        {/*  {dataUploadColumnTitles.map((title) => ( */}
        {/*    <ExtendedLabelCell key={title}>{title}</ExtendedLabelCell> */}
        {/*  ))} */}
        {/* </ExtendedLabelRow> */}

        <UploadedFilesTable>
          <ExtendedLabelRow>
            {dataUploadColumnTitles.map((title) => (
              <ExtendedLabelCell key={title}>{title}</ExtendedLabelCell>
            ))}
          </ExtendedLabelRow>
          {uploadedFiles.map((fileDetails) => {
            const fileRowDetails = getFileRowDetails(fileDetails);

            return (
              <UploadedFileRow
                key={fileRowDetails.key}
                fileRowDetails={fileRowDetails}
                deleteUploadedFile={deleteUploadedFile}
                updateUploadedFileStatus={updateUploadedFileStatus}
                setIsUnauthorizedRemoveFileModalOpen={
                  setIsUnauthorizedRemoveFileModalOpen
                }
              />
            );
          })}
        </UploadedFilesTable>
      </UploadedFilesContainer>

      {/* <ExtendedOpacityGradient /> */}
    </UploadedFilesWrapper>
  );
});
