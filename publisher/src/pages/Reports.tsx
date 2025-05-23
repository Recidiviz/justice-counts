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

import checkmarkIcon from "@justice-counts/common/assets/status-check-icon.png";
import { BadgeColorMapping } from "@justice-counts/common/components/Badge";
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
import { groupBy } from "@justice-counts/common/utils";
import { startCase } from "lodash";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  REPORT_LOWERCASE,
  REPORTING_PERIOD_CAPITALIZED,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../components/Global/constants";
import { Loading } from "../components/Loading";
import { LoadingError } from "../components/Loading/LoadingError";
import {
  ResourceTypes,
  UnauthorizedDeleteActionModal,
} from "../components/Modals";
import {
  DisclaimerBanner,
  TeamMemberNameWithBadge,
} from "../components/primitives";
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
  LabelStatus,
  MobileRecordsPageTitle,
  NoReportsDisplay,
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
  printDateAsDayMonthYear,
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
  REPORTING_PERIOD_CAPITALIZED,
  "Status",
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
  const isSuperagency = userStore.isAgencySuperagency(agencyId);

  const disclaimerBannerRef = useRef<HTMLDivElement>(null);

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
  const [
    isUnauthorizedRemoveRecordsModalOpen,
    setIsUnauthorizedRemoveRecordsModalOpen,
  ] = useState(false);

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

  const handleRemoveRecords = () => {
    if (!isJCAdmin) return;
    reportStore.deleteReports(selectedRecords, agencyId);
    clearBulkAction();
    clearAllSelectedRecords();
    setIsRemoveRecordsModalOpen(false);
  };
  const removeRecordsModalTitle = (
    <>
      Delete {selectedRecords.length} {REPORT_LOWERCASE}
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
  /**
   * Groups the filtered reports by report year and adds non-calendar year annual reports to the
   * year matching the report's ending year period (e.g. Feb 2023 - Jan 2024 report will belong to year 2024)
   */
  const filteredReportsMemoizedByReportYears = groupBy(
    filteredReportsMemoized,
    (report) =>
      report.frequency === "ANNUAL" && report.month !== 1 // Note: `report.month` is not zero-indexed
        ? report.year + 1 // Add non-calendar year reports to the (`report.year` + 1) year group (the report's end year period)
        : report.year
  );

  /** Reports sorted by year in descending order */
  const sortedReportsEntries = Object.entries(
    filteredReportsMemoizedByReportYears
  ).sort(
    ([reportYearA], [reportYearB]) => Number(reportYearB) - Number(reportYearA)
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
    },
    {
      key: "unpublishAction",
      label: "Unpublish",
      onClick: () => selectBulkAction("unpublish"),
      disabled: isUnpublishDisabled,
    },
    {
      key: "deleteAction",
      label: "Delete",
      onClick: () =>
        isJCAdmin
          ? selectBulkAction("delete")
          : setIsUnauthorizedRemoveRecordsModalOpen(true),
      color: "red",
    },
  ] as DropdownOption[];
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

  /**
   * Sort callback function that will sort an array of `ReportOverview` objects
   * in descending order by year and month, and annual records before monthly records.
   */
  const sortReportsAnnualFirstDescending = (
    a: ReportOverview,
    b: ReportOverview
  ) => {
    /**
     * Convert month & year of both ReportOverview objects to a timestamp
     * for easy comparison.
     */
    const dateA = new Date(a.year, a.month - 1).getTime();
    const dateB = new Date(b.year, b.month - 1).getTime();

    /**
     * Handle sorting within the same year group:
     *   - Annual records sorted before monthly records
     *   - All annual & monthly records sorted by their month in descending order
     */
    if (a.year === b.year) {
      if (a.frequency === "ANNUAL") {
        if (a.month <= b.month) {
          return 1;
        }
        return -1;
      }
      if (b.frequency === "ANNUAL") {
        return 1;
      }
    }

    /** In general - order annual records before monthly records (and according to their timestamps)  */
    return a.frequency === "ANNUAL" ? dateA - dateB : dateB - dateA;
  };

  const renderReports = () => {
    if (reportStore.loadingOverview) {
      return <Loading />;
    }
    if (loadingError) {
      return <LoadingError />;
    }

    const reportStatusBadgeColors: BadgeColorMapping = {
      DRAFT: "ORANGE",
      PUBLISHED: "GREEN",
      NOT_STARTED: "RED",
    };

    return (
      <>
        {filteredReportsMemoized.length > 0 ? (
          sortedReportsEntries.map(([reportYear, reports]) => (
            <Fragment key={reportYear}>
              {/* Only show report year marker for prior years (before current year) */}
              {new Date().getUTCFullYear() !== Number(reportYear) && (
                <Row noHover isRowReportYear>
                  {reportYear}
                </Row>
              )}

              {reports
                .sort(sortReportsAnnualFirstDescending)
                .map((report: ReportOverview) => {
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
                        selected={
                          bulkAction && selectedRecords.includes(report.id)
                        }
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
                                  <SelectedCheckmark
                                    src={checkmarkIcon}
                                    alt=""
                                  />
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
                        </Cell>

                        {/* Status */}
                        <Cell>
                          <LabelStatus
                            color={reportStatusBadgeColors[report.status]}
                          >
                            {startCase(
                              removeSnakeCase(report.status).toLowerCase()
                            )}
                          </LabelStatus>
                        </Cell>

                        {/* Frequency */}
                        <Cell capitalize>
                          {printReportFrequency(report.month, report.frequency)}
                        </Cell>

                        {/* Editors */}
                        <Cell>
                          {filteredReportEditors.length === 0 ? (
                            "-"
                          ) : (
                            <EditorsContentCellContainer
                              id={`record-${report.id}`}
                            >
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
                                          idx ===
                                          filteredReportEditors.length - 1
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
                            : printDateAsDayMonthYear(report.last_modified_at)}
                        </Cell>
                      </Row>
                    </Fragment>
                  );
                })}
            </Fragment>
          ))
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
      {isUnauthorizedRemoveRecordsModalOpen && (
        <UnauthorizedDeleteActionModal
          closeModal={() => setIsUnauthorizedRemoveRecordsModalOpen(false)}
          resourceType={ResourceTypes.RECORD}
        />
      )}

      {isRemoveRecordsModalOpen && (
        <Modal
          title={removeRecordsModalTitle}
          description="You can’t undo this action"
          buttons={[
            { label: "Delete", onClick: handleRemoveRecords },
            {
              label: "Cancel",
              onClick: () => setIsRemoveRecordsModalOpen(false),
            },
          ]}
          unsavedChangesConfigs
          customPadding="32px"
        />
      )}

      <ReportsHeader>
        {isSuperagency && (
          <DisclaimerBanner ref={disclaimerBannerRef}>
            If you would like to view or add data to metrics for the child
            agencies you manage, please switch to the specific child
            agency&apos;s Records page.
          </DisclaimerBanner>
        )}
        <DesktopRecordsPageTitle>{REPORTS_CAPITALIZED}</DesktopRecordsPageTitle>

        {/* Filter Reports By */}
        <ActionsWrapper noPadding={windowWidth < MIN_TABLET_WIDTH}>
          {!bulkAction && (
            <>
              <TabbedBarContainer>
                <TabbedBar options={tabbedBarOptions} size="medium" />
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
                      fullWidth
                    />
                  </BulkActionsDropdownContainer>
                  <Button
                    label="New Record"
                    buttonColor="blue"
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
                      buttonColor="blue"
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
                      buttonColor="blue"
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
      <Table
        isSuperagency={isSuperagency}
        disclaimerBannerHeight={disclaimerBannerRef.current?.clientHeight}
      >
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
