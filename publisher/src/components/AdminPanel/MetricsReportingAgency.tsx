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

import { Dropdown } from "@justice-counts/common/components/Dropdown";
import { removeSnakeCase } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React from "react";

import { useStore } from "../../stores";
import { DropdownContainer } from "../Reports/CreateReport.styled";
import * as Styled from "./AdminPanel.styles";

type MetricsReportingAgencyProps = {
  selectedIDToEdit?: string | number;
};

export const MetricsReportingAgency: React.FC<MetricsReportingAgencyProps> =
  observer(({ selectedIDToEdit }) => {
    const { adminPanelStore } = useStore();

    const {
      reportingAgencyMetadata,
      reportingAgenciesUpdates,
      updateReportingAgencies,
    } = adminPanelStore;

    if (!reportingAgencyMetadata || !selectedIDToEdit) return null;

    const hasMultipleSystems =
      Object.entries(reportingAgencyMetadata.metrics).length > 1;

    return (
      <Styled.ReportingAgencyWrapper>
        <Styled.ReportingAgencyTitle>
          Assign a reporting agency for each metric.
        </Styled.ReportingAgencyTitle>

        {Object.entries(reportingAgencyMetadata?.metrics).map(
          ([system, metrics]) => (
            <React.Fragment key={system}>
              {hasMultipleSystems && (
                <Styled.ReportingAgencyTitle noMargin capitalize>
                  {removeSnakeCase(system).toLowerCase()}
                </Styled.ReportingAgencyTitle>
              )}
              <Styled.ReportingAgencyMetricsContainer>
                {metrics.map((metric) => {
                  const initialReportingAgency =
                    reportingAgencyMetadata.reporting_agencies[system].find(
                      (agency) => agency.metric_key === metric.key
                    );
                  const updatedReportingAgency = reportingAgenciesUpdates.find(
                    (agency) => agency.metric_key === metric.key
                  );
                  const selectedReportingAgency =
                    updatedReportingAgency || initialReportingAgency;

                  const dropdownOptions = [
                    {
                      key: selectedIDToEdit,
                      label: "Current Agency",
                      onClick: () =>
                        updateReportingAgencies(
                          metric.key,
                          Number(selectedIDToEdit),
                          "Current Agency",
                          true
                        ),
                      highlight:
                        selectedReportingAgency?.reporting_agency_id ===
                        Number(selectedIDToEdit),
                    },
                    ...reportingAgencyMetadata.reporting_agency_options.map(
                      (option) => ({
                        key: option.reporting_agency_id,
                        label: option.reporting_agency_name,
                        onClick: () =>
                          updateReportingAgencies(
                            metric.key,
                            Number(option.reporting_agency_id),
                            option.reporting_agency_name,
                            false
                          ),
                        highlight:
                          selectedReportingAgency?.reporting_agency_id ===
                          option.reporting_agency_id,
                      })
                    ),
                    {
                      key: "select-none",
                      label: "None",
                      onClick: () =>
                        updateReportingAgencies(metric.key, null, null, null),
                      highlight:
                        selectedReportingAgency?.reporting_agency_id === null,
                    },
                  ];

                  const hasReportingAgency = Boolean(
                    selectedReportingAgency?.reporting_agency_id
                  );

                  const reportingAgencyName =
                    hasReportingAgency &&
                    selectedReportingAgency?.is_self_reported
                      ? "Current Agency"
                      : selectedReportingAgency?.reporting_agency_name;

                  return (
                    <Styled.ReportingAgencyMetricWrapper key={metric.key}>
                      <Styled.ReportingAgencyMetricName>
                        {metric.name}
                      </Styled.ReportingAgencyMetricName>
                      <Styled.ReportingAgencyDropdownWrapper>
                        <DropdownContainer>
                          <Dropdown
                            label={reportingAgencyName ?? "None"}
                            options={dropdownOptions}
                            hover="background"
                            caretPosition="right"
                            fullWidth
                          />
                        </DropdownContainer>
                      </Styled.ReportingAgencyDropdownWrapper>
                    </Styled.ReportingAgencyMetricWrapper>
                  );
                })}
              </Styled.ReportingAgencyMetricsContainer>
            </React.Fragment>
          )
        )}
      </Styled.ReportingAgencyWrapper>
    );
  });
