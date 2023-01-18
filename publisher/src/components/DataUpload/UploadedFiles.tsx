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

import {
  Badge,
  BadgeColorMapping,
  BadgeColors,
} from "@justice-counts/common/components/Badge";
import { showToast } from "@justice-counts/common/components/Toast";
import { Permission } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useStore } from "../../stores";
import { removeSnakeCase } from "../../utils";
import downloadIcon from "../assets/download-icon.png";
import { Title, TitleWrapper } from "../Forms";
import { Loader } from "../Loading";
import { TeamMemberNameWithBadge } from "../primitives";
import {
  ActionButton,
  ActionsContainer,
  DownloadIcon,
  ExtendedCell,
  ExtendedLabelCell,
  ExtendedLabelRow,
  ExtendedOpacityGradient,
  ExtendedRow,
  UploadedContainer,
  UploadedFile,
  UploadedFilesContainer,
  UploadedFilesError,
  UploadedFilesLoading,
  UploadedFilesTable,
  UploadedFileStatus,
  UploadedFilesWrapper,
} from ".";

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
    system?: string;
    uploadedBy: string;
  };
  deleteUploadedFile: (spreadsheetID: number) => void;
  updateUploadedFileStatus: (
    spreadsheetID: number,
    status: UploadedFileStatus
  ) => Promise<void>;
}> = observer(
  ({ fileRowDetails, deleteUploadedFile, updateUploadedFileStatus }) => {
    const { reportStore, userStore } = useStore();
    const [isDownloading, setIsDownloading] = useState(false);
    const [rowHovered, setRowHovered] = useState(false);

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
      uploadedBy,
    } = fileRowDetails;

    useEffect(
      () => {
        if (rowHovered) setRowHovered(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [fileRowDetails]
    );

    return (
      <ExtendedRow
        selected={selected}
        onClick={() => id && handleDownload(id, name)}
        onMouseOver={() => setRowHovered(true)}
        onMouseLeave={() => setRowHovered(false)}
      >
        {/* Filename */}
        <ExtendedCell>
          {rowHovered && id && <DownloadIcon src={downloadIcon} alt="" />}
          <span>{name}</span>
          <Badge
            color={badgeColor}
            loading={isDownloading || badgeText === "Uploading"}
          >
            {isDownloading ? "Downloading" : badgeText}
          </Badge>
        </ExtendedCell>

        {/* Date Uploaded */}
        <ExtendedCell capitalize>
          <UploadedContainer>
            <TeamMemberNameWithBadge
              name={uploadedBy}
              permission={Permission.AGENCY_ADMIN}
            />{" "}
            / {dateUploaded}
          </UploadedContainer>
        </ExtendedCell>

        {/* Date Ingested */}
        <ExtendedCell capitalize>
          <span>{dateIngested}</span>
        </ExtendedCell>

        {rowHovered && id && (
          <ActionsContainer onClick={(e) => e.stopPropagation()}>
            {userStore.isRecidivizAdmin && (
              <>
                {(badgeText === "processed" || badgeText === "error") && (
                  <ActionButton
                    onClick={() => updateUploadedFileStatus(id, "UPLOADED")}
                  >
                    Mark as Pending
                  </ActionButton>
                )}
                {(badgeText === "pending" || badgeText === "error") && (
                  <ActionButton
                    onClick={() => updateUploadedFileStatus(id, "INGESTED")}
                  >
                    Mark as Processed
                  </ActionButton>
                )}
                {badgeText !== "error" && (
                  <ActionButton
                    onClick={() => updateUploadedFileStatus(id, "ERRORED")}
                  >
                    Mark as Error
                  </ActionButton>
                )}
              </>
            )}

            <ActionButton red onClick={() => deleteUploadedFile(id)}>
              Delete
            </ActionButton>
          </ActionsContainer>
        )}

        <ExtendedCell capitalize>
          {/* System */}
          <span>{system}</span>
        </ExtendedCell>
      </ExtendedRow>
    );
  }
);

export const UploadedFiles: React.FC = observer(() => {
  const { agencyId } = useParams();
  const { reportStore } = useStore();
  const dataUploadColumnTitles = [
    "Filename",
    "Uploaded",
    "Processed",
    "System",
  ];

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

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
      system: removeSnakeCase(file.system).toLowerCase(),
      uploadedBy: file.uploaded_by,
    };
  };

  const deleteUploadedFile = async (spreadsheetID: number) => {
    const response = await reportStore.deleteUploadedSpreadsheet(spreadsheetID);

    if (response instanceof Error) {
      return showToast({ message: response.message, color: "red" });
    }

    return setUploadedFiles((prev) => {
      const filteredFiles = prev.filter((file) => file.id !== spreadsheetID);

      return filteredFiles;
    });
  };

  const updateUploadedFileStatus = async (
    spreadsheetID: number,
    status: UploadedFileStatus
  ) => {
    const response = await reportStore.updateFileStatus(spreadsheetID, status);

    if (response instanceof Error) {
      return showToast({ message: response.message, color: "red" });
    }

    return fetchListOfUploadedFiles();
  };

  const fetchListOfUploadedFiles = async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = (await reportStore.getUploadedFilesList(agencyId!)) as
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
    []
  );

  if (isLoading) {
    return (
      <UploadedFilesLoading>
        <Loader />
      </UploadedFilesLoading>
    );
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
      <TitleWrapper>
        <Title>Uploaded Files</Title>
      </TitleWrapper>

      <UploadedFilesContainer>
        <ExtendedLabelRow>
          {dataUploadColumnTitles.map((title) => (
            <ExtendedLabelCell key={title}>{title}</ExtendedLabelCell>
          ))}
        </ExtendedLabelRow>

        <UploadedFilesTable>
          {uploadedFiles.map((fileDetails) => {
            const fileRowDetails = getFileRowDetails(fileDetails);

            return (
              <UploadedFileRow
                key={fileRowDetails.key}
                fileRowDetails={fileRowDetails}
                deleteUploadedFile={deleteUploadedFile}
                updateUploadedFileStatus={updateUploadedFileStatus}
              />
            );
          })}
        </UploadedFilesTable>
      </UploadedFilesContainer>

      <ExtendedOpacityGradient />
    </UploadedFilesWrapper>
  );
});
