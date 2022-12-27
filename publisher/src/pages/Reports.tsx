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
import {
  MIN_TABLET_WIDTH,
  palette,
} from "@justice-counts/common/components/GlobalStyles";
import { useWindowWidth } from "@justice-counts/common/hooks";
import { ReportOverview } from "@justice-counts/common/types";
import { Dropdown } from "@recidiviz/design-system";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import dropdownArrow from "../components/assets/dropdown-arrow.svg";
import {
  REPORT_LOWERCASE,
  REPORT_PERIOD_CAPITALIZED,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../components/Global/constants";
import { Loading } from "../components/Loading";
import { ExtendedDropdownMenuItem } from "../components/Menu";
import { Onboarding } from "../components/Onboarding";
import { TeamMemberNameWithBadge } from "../components/primitives";
import {
  AdditionalEditorsTooltip,
  AndOthersSpan,
  Cell,
  CommaSpan,
  DropdownContainer,
  EmptySelectionCircle,
  LabelCell,
  LabelRow,
  NoReportsDisplay,
  PageTitle,
  ReportActions,
  ReportActionsItem,
  ReportActionsNewIcon,
  ReportActionsSelectIcon,
  ReportsHeader,
  Row,
  SelectedCheckmark,
  StatusFilterDropdownMenu,
  StatusFilterDropdownToggle,
  TabbedActionsWrapper,
  TabbedBar,
  TabbedItem,
  TabbedOptions,
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

const Reports: React.FC = () => {
  const { reportStore, userStore } = useStore();
  const { agencyId } = useParams<string>() as { agencyId: string };
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [loadingError, setLoadingError] = useState<string | undefined>(
    undefined
  );
  const [showAdditionalEditorsTooltip, setShowAdditionalEditorsTooltip] =
    useState<number>();
  const [reportsFilter, setReportsFilter] = useState<string>(
    `all_${REPORTS_LOWERCASE}`
  );
  const [selectionMode, setSelectionMode] = useState(false);
  const [reportsToDelete, setReportsToDelete] = useState<number[]>([]);

  const enterSelectionMode = () => setSelectionMode(true);
  const exitSelectionMode = () => setSelectionMode(false);
  const clearAllReportsToDelete = () => setReportsToDelete([]);
  const addOrRemoveReportToDelete = (reportID: number) =>
    setReportsToDelete((prev) =>
      !prev.includes(reportID)
        ? [...prev, reportID]
        : prev.filter((id) => id !== reportID)
    );

  const filterReportsBy = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    const { id } = e.target as HTMLDivElement;
    const normalizedID = normalizeString(id);
    setReportsFilter(normalizedID);
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
                      if (!selectionMode) {
                        navigate(`${report.id}`);
                      } else {
                        addOrRemoveReportToDelete(report.id);
                      }
                    }}
                    selected={
                      selectionMode && reportsToDelete.includes(report.id)
                    }
                  >
                    {/* Report Period */}
                    <Cell id="report_period">
                      {selectionMode && (
                        <>
                          {reportsToDelete.includes(report.id) ? (
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
                    <Cell
                      onMouseEnter={() => {
                        if (filteredReportEditors.length > 1) {
                          setShowAdditionalEditorsTooltip(report.id);
                        }
                      }}
                      onMouseLeave={() =>
                        setShowAdditionalEditorsTooltip(undefined)
                      }
                    >
                      {filteredReportEditors.length === 0 ? (
                        "-"
                      ) : (
                        <>
                          {/* TODO(#334) Hook up admin badges rendering to team member roles API */}
                          <TeamMemberNameWithBadge
                            name={filteredReportEditors[0].name}
                            badgeId={report.id.toString()}
                            role={filteredReportEditors[0].role}
                          />
                          {filteredReportEditors.length > 1 ? (
                            <AndOthersSpan>{`& ${
                              filteredReportEditors.length - 1
                            } other${
                              filteredReportEditors.length > 2 ? "s" : ""
                            }`}</AndOthersSpan>
                          ) : null}

                          {showAdditionalEditorsTooltip === report.id && (
                            <AdditionalEditorsTooltip>
                              {filteredReportEditors.map((editor, idx) => (
                                <React.Fragment key={editor.name}>
                                  {/* TODO(#334) Hook up admin badges rendering to team member roles API */}
                                  <TeamMemberNameWithBadge
                                    name={editor.name}
                                    badgeColor={palette.solid.white}
                                    role={editor.role}
                                  />
                                  {idx < filteredReportEditors.length - 1 && (
                                    <CommaSpan />
                                  )}
                                </React.Fragment>
                              ))}
                            </AdditionalEditorsTooltip>
                          )}
                        </>
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
      <ReportsHeader>
        {windowWidth > MIN_TABLET_WIDTH && (
          <PageTitle>{REPORTS_CAPITALIZED}</PageTitle>
        )}

        {/* Filter Reports By */}
        <TabbedBar noPadding={windowWidth < MIN_TABLET_WIDTH}>
          {windowWidth > MIN_TABLET_WIDTH ? (
            <TabbedOptions>
              {Object.entries(ReportStatusFilterOptionObject).map(
                ([key, value]) => (
                  <TabbedItem
                    key={key}
                    id={key}
                    selected={key === reportsFilter}
                    onClick={(e) => filterReportsBy(e)}
                  >
                    {removeSnakeCase(value)}
                  </TabbedItem>
                )
              )}
            </TabbedOptions>
          ) : (
            <PageTitle>{REPORTS_CAPITALIZED}</PageTitle>
          )}

          <TabbedActionsWrapper>
            {/* Admin Only: Manage Reports */}
            {(userStore.isJusticeCountsAdmin(agencyId) ||
              userStore.isAgencyAdmin(agencyId)) && (
              <>
                <ReportActions>
                  {!selectionMode && (
                    <>
                      {userStore.isJusticeCountsAdmin(agencyId) && (
                        <ReportActionsItem onClick={enterSelectionMode}>
                          Select <ReportActionsSelectIcon />
                        </ReportActionsItem>
                      )}
                      <ReportActionsItem onClick={() => navigate("create")}>
                        New <ReportActionsNewIcon />
                      </ReportActionsItem>
                    </>
                  )}

                  {selectionMode && (
                    <>
                      <ReportActionsItem
                        disabled={reportsToDelete.length === 0}
                        onClick={() => {
                          if (reportsToDelete.length > 0) {
                            reportStore.deleteReports(
                              reportsToDelete,
                              agencyId
                            );
                            exitSelectionMode();
                            clearAllReportsToDelete();
                          }
                        }}
                      >
                        Delete{" "}
                        <ReportActionsSelectIcon
                          disabled={reportsToDelete.length === 0}
                        />
                      </ReportActionsItem>
                      <ReportActionsItem
                        onClick={() => {
                          exitSelectionMode();
                          clearAllReportsToDelete();
                        }}
                      >
                        Done
                      </ReportActionsItem>
                    </>
                  )}
                </ReportActions>
              </>
            )}
          </TabbedActionsWrapper>
        </TabbedBar>

        {/* MobileViewDropdown */}
        <DropdownContainer>
          <Dropdown>
            <StatusFilterDropdownToggle kind="borderless">
              <img src={dropdownArrow} alt="" />
              {ReportStatusFilterOptionObject[reportsFilter]}
            </StatusFilterDropdownToggle>
            <StatusFilterDropdownMenu>
              {Object.entries(ReportStatusFilterOptionObject).map(
                ([key, value]) => (
                  <ExtendedDropdownMenuItem
                    highlight={
                      ReportStatusFilterOptionObject[reportsFilter] === value
                    }
                    key={key}
                    onClick={() => setReportsFilter(normalizeString(key))}
                  >
                    {value}
                  </ExtendedDropdownMenuItem>
                )
              )}
            </StatusFilterDropdownMenu>
          </Dropdown>
        </DropdownContainer>
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

      {/* Onboarding */}
      {userStore.onboardingTopicsCompleted?.reportsview === false &&
        showOnboarding && (
          <Onboarding
            setShowOnboarding={setShowOnboarding}
            topic="reportsview"
          />
        )}
    </>
  );
};

export default observer(Reports);
