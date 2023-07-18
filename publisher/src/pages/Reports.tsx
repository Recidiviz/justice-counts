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

import checkmarkIcon from "@justice-counts/common/assets/status-check-icon.png";
import {
  Badge,
  BadgeColorMapping,
} from "@justice-counts/common/components/Badge";
import { Button } from "@justice-counts/common/components/Button";
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import {
  MIN_TABLET_WIDTH,
  palette,
} from "@justice-counts/common/components/GlobalStyles";
import { Modal } from "@justice-counts/common/components/Modal";
import {
  TabbedBar,
  TabOption,
} from "@justice-counts/common/components/TabbedBar";
import { Tooltip } from "@justice-counts/common/components/Tooltip";
import { useWindowWidth } from "@justice-counts/common/hooks";
import { ReportOverview, ReportStatus } from "@justice-counts/common/types";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  REPORT_LOWERCASE,
  REPORT_PERIOD_CAPITALIZED,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../components/Global/constants";
import { Loading } from "../components/Loading";
import { TeamMemberNameWithBadge } from "../components/primitives";
import {
  ActionsWrapper,
  AndOthersSpan,
  BulkActionModeTitle,
  BulkActionsDropdownContainer,
  Cell,
  DesktopRecordsPageTitle,
  EditorsContentCellContainer,
  EditorsTooltipContainer,
  EmptySelectionCircle,
  LabelCell,
  LabelRow,
  MobileRecordsPageTitle,
  NoReportsDisplay,
  RemoveRecordsNumber,
  ReportActions,
  ReportsFilterDropdownContainer,
  ReportsHeader,
  Row,
  SelectedCheckmark,
  TabbedBarContainer,
  Table,
} from "../components/Reports";
import { useStore } from "../stores";
import {
  filterJCAdminEditors,
  normalizeString,
  printElapsedDaysMonthsYearsSinceDate,
  printReportFrequency,
  printReportTitle,
  removeSnakeCase,
} from "../utils";

const ReportStatusFilterOptionObject: { [key: string]: string } = {
  all_records: "All Records",
  draft: "Draft",
  published: "Published",
  not_started: "Not Started",
};

const reportListColumnTitles = [
  REPORT_PERIOD_CAPITALIZED,
  "Frequency",
  "Editors",
  "Last Modified",
];

export type RecordsBulkAction = "publish" | "unpublish" | "delete";

const Reports: React.FC = () => {
  const { reportStore, userStore } = useStore();
  const { agencyId } = useParams<string>() as { agencyId: string };
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();

  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [reportsFilter, setReportsFilter] = useState<string>(
    `all_${REPORTS_LOWERCASE}`
  );
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<RecordsBulkAction | undefined>(
    undefined
  );
  const [isRemoveRecordsModalOpen, setIsRemoveRecordsModalOpen] =
    useState(false);

  const isAdmin =
    userStore.isJusticeCountsAdmin(agencyId) ||
    userStore.isAgencyAdmin(agencyId);
  const isJCAdmin = userStore.isJusticeCountsAdmin(agencyId);

  const selectBulkAction = (action: RecordsBulkAction) => setBulkAction(action);
  const clearBulkAction = () => setBulkAction(undefined);
  const clearAllSelectedRecords = () => setSelectedRecords([]);
  const addOrRemoveSelectedRecords = (
    reportID: number,
    isRecordDisabledForSelection: boolean
  ) => {
    if (!isRecordDisabledForSelection) {
      setSelectedRecords((prev) =>
        !prev.includes(reportID)
          ? [...prev, reportID]
          : prev.filter((id) => id !== reportID)
      );
    }
  };
  const isRecordDisabledForSelection = (
    status: ReportStatus,
    action: RecordsBulkAction
  ) => {
    if (action === "publish")
      return status === "PUBLISHED" || status === "NOT_STARTED";
    if (action === "unpublish")
      return status === "DRAFT" || status === "NOT_STARTED";
    return false;
  };

  const renderReportYearRow = (
    filteredReports: ReportOverview[],
    currentIndex: number,
    currentReportYear: number
  ): JSX.Element | undefined => {
    const indexIsLessThanListOfReports =
      currentIndex + 1 < filteredReports.length;
    const nextReportYear =
      indexIsLessThanListOfReports && filteredReports[currentIndex + 1].year;

    if (indexIsLessThanListOfReports && nextReportYear !== currentReportYear) {
      return (
        <Row noHover isRowReportYear>
          {nextReportYear}
        </Row>
      );
    }
  };

  const handleRemoveRecords = () => {
    reportStore.deleteReports(selectedRecords, agencyId);
    clearBulkAction();
    clearAllSelectedRecords();
    setIsRemoveRecordsModalOpen(false);
  };
  const removeRecordsModalTitle = (
    <>
      Delete <RemoveRecordsNumber>{selectedRecords.length}</RemoveRecordsNumber>{" "}
      {REPORT_LOWERCASE}
      {selectedRecords.length > 1 ? "s" : ""}?
    </>
  );

  useEffect(() => {
    const initialize = async () => {
      reportStore.resetState();
      const result = await reportStore.getReportOverviews(agencyId);
      if (result instanceof Error) {
        setLoadingError(result.message);
      } else {
        setLoadingError(undefined);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyId]);

  const filteredReportsMemoized = React.useMemo(
    () =>
      reportsFilter === `all_${REPORTS_LOWERCASE}`
        ? reportStore.reportOverviewList
        : reportStore.reportOverviewList.filter(
            (report) => normalizeString(report.status) === reportsFilter
          ),
    [reportStore.reportOverviewList, reportsFilter]
  );

  const isPublishDisabled =
    reportsFilter === "published" ||
    reportsFilter === "not_started" ||
    filteredReportsMemoized.filter((record) => record.status === "DRAFT")
      .length === 0;
  const isUnpublishDisabled =
    reportsFilter === "draft" ||
    reportsFilter === "not_started" ||
    filteredReportsMemoized.filter((record) => record.status === "PUBLISHED")
      .length === 0;
  const bulkActionsDropdownOptions = [
    {
      key: "publishAction",
      label: "Publish",
      onClick: () => selectBulkAction("publish"),
      disabled: isPublishDisabled,
      noHover: true,
    },
    {
      key: "unpublishAction",
      label: "Unpublish",
      onClick: () => selectBulkAction("unpublish"),
      disabled: isUnpublishDisabled,
      noHover: true,
    },
    {
      key: "deleteAction",
      label: "Delete",
      onClick: () => selectBulkAction("delete"),
      color: "red",
      noHover: true,
    },
  ].filter((option) => {
    // Gates `Delete` action to Justice Counts Admins only
    if (option.key === "deleteAction" && !isJCAdmin) {
      return false;
    }
    return true;
  }) as DropdownOption[];
  const tabbedBarOptions: TabOption[] = Object.entries(
    ReportStatusFilterOptionObject
  ).map(([key, value]) => ({
    key,
    label: removeSnakeCase(value),
    onClick: () => setReportsFilter(normalizeString(key)),
    selected: key === reportsFilter,
  }));
  const reportsFilterDropdownOptions: DropdownOption[] = Object.entries(
    ReportStatusFilterOptionObject
  ).map(([key, value]) => ({
    key,
    label: value,
    onClick: () => setReportsFilter(normalizeString(key)),
    highlight: ReportStatusFilterOptionObject[reportsFilter] === value,
  }));

  const renderReports = () => {
    if (reportStore.loadingOverview) {
      return <Loading />;
    }
    if (loadingError) {
      return <Row>{`Error: ${loadingError}`}</Row>;
    }

    const reportStatusBadgeColors: BadgeColorMapping = {
      DRAFT: "ORANGE",
      PUBLISHED: "GREEN",
      NOT_STARTED: "RED",
    };

    return (
      <>
        {filteredReportsMemoized.length > 0 ? (
          filteredReportsMemoized.map(
            (report: ReportOverview, index: number) => {
              const filteredReportEditors = filterJCAdminEditors(
                report.editors
              );
              return (
                <Fragment key={report.id}>
                  <Row
                    onClick={() => {
                      if (!bulkAction) {
                        navigate(`${report.id}`);
                      } else {
                        addOrRemoveSelectedRecords(
                          report.id,
                          isRecordDisabledForSelection(
                            report.status,
                            bulkAction
                          )
                        );
                      }
                    }}
                    selected={bulkAction && selectedRecords.includes(report.id)}
                  >
                    {/* Report Period */}
                    <Cell id="report_period">
                      {bulkAction &&
                        !isRecordDisabledForSelection(
                          report.status,
                          bulkAction
                        ) && (
                          <>
                            {selectedRecords.includes(report.id) ? (
                              <SelectedCheckmark src={checkmarkIcon} alt="" />
                            ) : (
                              <EmptySelectionCircle />
                            )}
                          </>
                        )}
                      <span>
                        {printReportTitle(
                          report.month,
                          report.year,
                          report.frequency
                        )}
                      </span>
                      <Badge color={reportStatusBadgeColors[report.status]}>
                        {removeSnakeCase(report.status).toLowerCase()}
                      </Badge>
                    </Cell>

                    {/* Status */}
                    <Cell capitalize>
                      {printReportFrequency(report.month, report.frequency)}
                    </Cell>

                    {/* Editors */}
                    <Cell>
                      {filteredReportEditors.length === 0 ? (
                        "-"
                      ) : (
                        <EditorsContentCellContainer id={`record-${report.id}`}>
                          {/* TODO(#334) Hook up admin badges rendering to team member roles API */}
                          <TeamMemberNameWithBadge
                            name={filteredReportEditors[0].name}
                            badgeId={`admin-${report.id}`}
                            role={filteredReportEditors[0].role}
                          />
                          {filteredReportEditors.length > 1 ? (
                            <AndOthersSpan>{`& ${
                              filteredReportEditors.length - 1
                            } other${
                              filteredReportEditors.length > 2 ? "s" : ""
                            }`}</AndOthersSpan>
                          ) : null}
                        </EditorsContentCellContainer>
                      )}

                      {filteredReportEditors.length > 1 && (
                        <Tooltip
                          anchorId={`record-${report.id}`}
                          position="bottom"
                          content={
                            <EditorsTooltipContainer>
                              {filteredReportEditors.map((editor, idx) => (
                                <React.Fragment key={editor.name}>
                                  {/* TODO(#334) Hook up admin badges rendering to team member roles API */}
                                  <TeamMemberNameWithBadge
                                    name={editor.name}
                                    badgeColor={palette.solid.white}
                                    role={editor.role}
                                    isInsideTooltip
                                    isLast={
                                      idx === filteredReportEditors.length - 1
                                    }
                                  />
                                </React.Fragment>
                              ))}
                            </EditorsTooltipContainer>
                          }
                          noArrow
                          tooltipColor="info"
                        />
                      )}
                    </Cell>

                    {/* Last Modified */}
                    <Cell>
                      {!report.last_modified_at
                        ? "-"
                        : printElapsedDaysMonthsYearsSinceDate(
                            report.last_modified_at
                          )}
                    </Cell>
                  </Row>

                  {/* Report Year Marker */}
                  {renderReportYearRow(
                    filteredReportsMemoized,
                    index,
                    report.year
                  )}
                </Fragment>
              );
            }
          )
        ) : (
          <NoReportsDisplay>
            No {REPORTS_LOWERCASE} to display. Create a {REPORT_LOWERCASE}?
          </NoReportsDisplay>
        )}
      </>
    );
  };

  return (
    <>
      {isRemoveRecordsModalOpen && (
        <Modal
          title={removeRecordsModalTitle}
          description="You can’t undo this action."
          buttons={[
            { label: "Yes, Delete", onClick: handleRemoveRecords },
            {
              label: "No, Cancel",
              onClick: () => setIsRemoveRecordsModalOpen(false),
            },
          ]}
          modalType="alert"
        />
      )}

      <ReportsHeader>
        <DesktopRecordsPageTitle>{REPORTS_CAPITALIZED}</DesktopRecordsPageTitle>

        {/* Filter Reports By */}
        <ActionsWrapper noPadding={windowWidth < MIN_TABLET_WIDTH}>
          {!bulkAction && (
            <>
              <TabbedBarContainer>
                <TabbedBar options={tabbedBarOptions} size="large" />
              </TabbedBarContainer>
              <MobileRecordsPageTitle>
                {REPORTS_CAPITALIZED}
              </MobileRecordsPageTitle>
            </>
          )}

          {bulkAction === "publish" && (
            <BulkActionModeTitle>
              {selectedRecords.length
                ? `${selectedRecords.length} draft${
                    selectedRecords.length > 1 ? "s" : ""
                  } selected`
                : "Select draft(s) to publish..."}
            </BulkActionModeTitle>
          )}

          {bulkAction === "unpublish" && (
            <BulkActionModeTitle>
              {selectedRecords.length
                ? `${selectedRecords.length} ${REPORT_LOWERCASE}${
                    selectedRecords.length > 1 ? "s" : ""
                  } selected`
                : `Select ${REPORT_LOWERCASE}(s) to unpublish...`}
            </BulkActionModeTitle>
          )}

          {bulkAction === "delete" && (
            <BulkActionModeTitle>
              {selectedRecords.length
                ? `${selectedRecords.length} ${REPORT_LOWERCASE}${
                    selectedRecords.length > 1 ? "s" : ""
                  } selected`
                : `Select ${REPORT_LOWERCASE}(s) to delete...`}
            </BulkActionModeTitle>
          )}

          {/* Admin Only: Manage Reports */}
          {isAdmin && (
            <ReportActions>
              {!bulkAction && (
                <>
                  <BulkActionsDropdownContainer>
                    <Dropdown
                      label="Bulk Actions"
                      options={bulkActionsDropdownOptions}
                      size="small"
                      disabled={filteredReportsMemoized.length === 0}
                      hover="background"
                      caretPosition="right"
                      alignment="right"
                    />
                  </BulkActionsDropdownContainer>
                  <Button
                    label="+ New Record"
                    labelColor="blue"
                    borderColor="lightgrey"
                    onClick={() => navigate("create")}
                  />
                </>
              )}

              {bulkAction && (
                <>
                  <Button
                    label="Cancel"
                    onClick={() => {
                      clearAllSelectedRecords();
                      clearBulkAction();
                    }}
                    borderColor="lightgrey"
                  />
                  {bulkAction === "delete" && selectedRecords.length > 0 && (
                    <Button
                      label="Delete"
                      onClick={() => setIsRemoveRecordsModalOpen(true)}
                      buttonColor="red"
                    />
                  )}
                  {bulkAction === "publish" && selectedRecords.length > 0 && (
                    <Button
                      label="Review and Publish"
                      onClick={() =>
                        navigate("bulk-review", {
                          state: {
                            recordsIds: selectedRecords,
                            action: bulkAction,
                          },
                        })
                      }
                      buttonColor="green"
                    />
                  )}
                  {bulkAction === "unpublish" && selectedRecords.length > 0 && (
                    <Button
                      label="Review and Unpublish"
                      onClick={() =>
                        navigate("bulk-review", {
                          state: {
                            recordsIds: selectedRecords,
                            action: bulkAction,
                          },
                        })
                      }
                      buttonColor="orange"
                    />
                  )}
                </>
              )}
            </ReportActions>
          )}
        </ActionsWrapper>

        {/* MobileViewDropdown */}
        <ReportsFilterDropdownContainer>
          <Dropdown
            label={ReportStatusFilterOptionObject[reportsFilter]}
            options={reportsFilterDropdownOptions}
            caretPosition="left"
            fullWidth
          />
        </ReportsFilterDropdownContainer>
      </ReportsHeader>

      {/* Reports List Table */}
      <Table>
        <LabelRow>
          {reportListColumnTitles.map((title) => (
            <LabelCell key={title}>{title}</LabelCell>
          ))}
        </LabelRow>
        {renderReports()}
      </Table>
    </>
  );
};

export default observer(Reports);
