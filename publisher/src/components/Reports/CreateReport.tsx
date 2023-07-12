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

import { Button } from "@justice-counts/common/components/Button";
import {
  Dropdown,
  DropdownOption,
} from "@justice-counts/common/components/Dropdown";
import {
  RadioButton,
  RadioButtonsWrapper,
} from "@justice-counts/common/components/RadioButton";
import { showToast } from "@justice-counts/common/components/Toast";
import {
  CreateReportFormValuesType,
  ReportOverview,
} from "@justice-counts/common/types";
import React, { useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { trackReportCreated } from "../../analytics";
import { useStore } from "../../stores";
import { monthsByName, printDateRangeFromMonthYear } from "../../utils";
import {
  GoBackToReportsOverviewLink,
  MetricSectionSubTitle,
  MetricSectionTitle,
  OnePanelBackLinkContainer,
  PreTitle,
  Title,
  TitleWrapper,
} from "../Forms";
import {
  REPORT_CAPITALIZED,
  REPORT_LOWERCASE,
  REPORTING_LOWERCASE,
  REPORTS_CAPITALIZED,
  REPORTS_LOWERCASE,
} from "../Global/constants";
import { Loading } from "../Loading";
import * as Styled from "./CreateReport.styled";
import { PublishDataWrapper } from "./ReportDataEntry.styles";
import { ReportSummaryWrapper } from "./ReportSummaryPanel";

function createIntegerRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const initialCreateReportFormValues: CreateReportFormValuesType = {
  month: 1,
  year: new Date(Date.now()).getFullYear(),
  frequency: "MONTHLY",
  annualStartMonth: 1,
  isRecurring: false,
};

const CreateReport = () => {
  const { reportStore, userStore } = useStore();
  const { agencyId } = useParams() as { agencyId: string };
  const navigate = useNavigate();
  const { state } = useLocation();

  const [createReportFormValues, setCreateReportFormValues] = useState(
    initialCreateReportFormValues
  );
  const [isRecordCreating, setIsRecordCreating] = useState(false);

  const updateYearStandard = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCreateReportFormValues((prev) => ({
      ...prev,
      annualStartMonth: +e.target
        .value as CreateReportFormValuesType["annualStartMonth"],
    }));

  const updateFrequency = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCreateReportFormValues((prev) => ({
      ...prev,
      frequency: e.target.value as CreateReportFormValuesType["frequency"],
    }));

  // const updateIsRecurring = (recurring: boolean) =>
  //   setCreateReportFormValues((prev) => ({
  //     ...prev,
  //     isRecurring: recurring,
  //   }));

  const createNewReport = async () => {
    const { frequency, month, year, annualStartMonth, isRecurring } =
      createReportFormValues;
    setIsRecordCreating(true);
    const response = await reportStore.createReport(
      {
        frequency,
        month: frequency === "ANNUAL" ? annualStartMonth : month,
        is_recurring: isRecurring,
        year: isRecurring ? new Date(Date.now()).getFullYear() : year,
      },
      Number(agencyId)
    );
    if (response && response instanceof Response) {
      if (response.status === 200) {
        showToast({
          message: `The ${REPORT_LOWERCASE} was successfully created`,
          check: true,
        });
        const report = (await response.json()) as ReportOverview;
        const agency = userStore.userAgenciesById[report.agency_id];
        navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}/${report.id}`);
        trackReportCreated(report.id, agency);
        return;
      }
      const responseJson = await response.json();
      if (
        responseJson.description.includes(
          "A report of that date range has already been created."
        )
      ) {
        showToast({
          message: responseJson.description.replace("report", REPORT_LOWERCASE),
          color: "red",
        });
        setIsRecordCreating(false);
        return;
      }
      setIsRecordCreating(false);
    }
    showToast({
      message: `Error creating ${REPORT_LOWERCASE}`,
      color: "red",
    });
    setIsRecordCreating(false);
  };

  const { frequency, month, year, annualStartMonth, isRecurring } =
    createReportFormValues;

  const monthsOptions: DropdownOption[] = monthsByName.map(
    (monthName, index) => ({
      key: monthName,
      label: monthName,
      onClick: () =>
        setCreateReportFormValues((prev) => ({
          ...prev,
          month: (index + 1) as CreateReportFormValuesType["month"],
        })),
      highlight: index + 1 === month,
    })
  );

  const yearsOptions: DropdownOption[] = createIntegerRange(
    1970,
    new Date().getFullYear() + 1
  ).map((yearValue) => ({
    key: yearValue,
    label: yearValue,
    onClick: () =>
      setCreateReportFormValues((prev) => ({ ...prev, year: yearValue })),
    highlight: yearValue === year,
  }));

  if (userStore.isUserReadOnly(agencyId))
    return <Navigate to={`/agency/${agencyId}/${REPORTS_LOWERCASE}`} />;

  return (
    <>
      {isRecordCreating && (
        <Styled.LoadingWrapper>
          <Loading />
        </Styled.LoadingWrapper>
      )}
      {/* Create Report Details Panel */}
      <ReportSummaryWrapper>
        <Styled.BackButtonWrapper>
          <Button
            label={`<- Back to ${REPORTS_CAPITALIZED} Overview`}
            onClick={() => navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)}
            noSidePadding
            noTopBottomPadding
            labelColor="blue"
            noHover
          />
        </Styled.BackButtonWrapper>
        {/* <Title>Report Details</Title> */}
      </ReportSummaryWrapper>

      {/* Create Report Form */}
      <Styled.CreateReportFormWrapper>
        <Styled.NoRecordsForTaskCardManualEntryMessage>
          {state?.from === "Home" &&
            `It looks like there are no ${REPORTS_LOWERCASE} for the metric you would like to manually input data for. Please create a new ${REPORT_LOWERCASE}.`}
        </Styled.NoRecordsForTaskCardManualEntryMessage>
        <Styled.CreateReportForm>
          {/* Form Title */}
          <OnePanelBackLinkContainer>
            <GoBackToReportsOverviewLink
              onClick={() =>
                navigate(`/agency/${agencyId}/${REPORTS_LOWERCASE}`)
              }
            />
          </OnePanelBackLinkContainer>
          <PreTitle>Create {REPORT_CAPITALIZED}</PreTitle>
          <Title>New {REPORT_CAPITALIZED}</Title>
          <TitleWrapper underlined>
            <MetricSectionTitle>
              {REPORT_CAPITALIZED} Parameters
            </MetricSectionTitle>
            <MetricSectionSubTitle />
          </TitleWrapper>
          <Styled.Heading>
            What {REPORTING_LOWERCASE} frequency is this {REPORT_LOWERCASE}?
          </Styled.Heading>
          <RadioButtonsWrapper>
            <RadioButton
              type="radio"
              id="monthly"
              name="frequency"
              label="Monthly"
              value="MONTHLY"
              onChange={updateFrequency}
              defaultChecked={frequency === "MONTHLY"}
              buttonSize="large"
            />
            <RadioButton
              type="radio"
              id="annual"
              name="frequency"
              label="Annual"
              value="ANNUAL"
              onChange={updateFrequency}
              defaultChecked={frequency === "ANNUAL"}
              buttonSize="large"
            />
          </RadioButtonsWrapper>
          {createReportFormValues.frequency === "ANNUAL" && (
            <>
              <Styled.Heading>
                What year standard do you use for annual {REPORTS_LOWERCASE}?
              </Styled.Heading>
              <RadioButtonsWrapper>
                <RadioButton
                  type="radio"
                  id="calendar"
                  name="yearStandard"
                  label="Calendar Year (Jan - Dec)"
                  value={1}
                  onChange={updateYearStandard}
                  defaultChecked={annualStartMonth === 1}
                  buttonSize="large"
                />
                <RadioButton
                  type="radio"
                  id="fiscal"
                  name="yearStandard"
                  label="Fiscal Year (Jul - Jun)"
                  value={7}
                  onChange={updateYearStandard}
                  defaultChecked={annualStartMonth === 7}
                  buttonSize="large"
                />
              </RadioButtonsWrapper>
            </>
          )}
          {/* Disable recurring report toggle for now */}
          {/* TODO(#13229): Create recurring report flow */}
          {/* <Heading>Is this a recurring report?</Heading>
        <BinaryRadioGroupContainer>
          <BinaryRadioButton
            type="radio"
            id="no"
            name="recurring"
            label="No"
            value="NO"
            onChange={() => updateIsRecurring(false)}
            defaultChecked
          />
          <BinaryRadioButton
            type="radio"
            id="yes"
            name="recurring"
            label="Yes"
            value="YES"
            onChange={() => updateIsRecurring(true)}
          />
        </BinaryRadioGroupContainer> */}
          {createReportFormValues.isRecurring === false && (
            <>
              <Styled.Heading>
                When should this {REPORT_LOWERCASE} start?
              </Styled.Heading>
              <Styled.DropdownsWrapper>
                {createReportFormValues.frequency === "MONTHLY" && (
                  <Styled.DropdownContainer>
                    <Dropdown
                      label={monthsByName[month - 1]}
                      options={monthsOptions}
                      hover="background"
                      caretPosition="right"
                      fullWidth
                    />
                  </Styled.DropdownContainer>
                )}

                <Styled.DropdownContainer>
                  <Dropdown
                    label={year}
                    options={yearsOptions}
                    hover="background"
                    caretPosition="right"
                    fullWidth
                  />
                </Styled.DropdownContainer>
              </Styled.DropdownsWrapper>
            </>
          )}
          <Styled.CreateReportInfoContainer>
            The{" "}
            <Styled.BoldFont>{isRecurring ? `recurring` : ``}</Styled.BoldFont>{" "}
            {REPORT_LOWERCASE} will be created for{` `}
            <Styled.BoldFont>
              {printDateRangeFromMonthYear(
                frequency === "ANNUAL" ? annualStartMonth : month,
                isRecurring ? new Date(Date.now()).getFullYear() : year,
                frequency
              )}
            </Styled.BoldFont>
            .
          </Styled.CreateReportInfoContainer>
          <Styled.FormCreateButtonContainer>
            <Button
              label={`Create ${REPORT_CAPITALIZED}`}
              onClick={createNewReport}
              buttonColor="blue"
              size="medium"
            />
          </Styled.FormCreateButtonContainer>
        </Styled.CreateReportForm>
      </Styled.CreateReportFormWrapper>

      {/* Create Report Review Panel */}
      <PublishDataWrapper>
        <Styled.CreateButtonContainer>
          <Button
            label={`Create ${REPORT_CAPITALIZED}`}
            /** Should trigger a confirmation dialogue before submitting */
            onClick={createNewReport}
            buttonColor="blue"
            size="medium"
          />
        </Styled.CreateButtonContainer>
      </PublishDataWrapper>
    </>
  );
};

export default CreateReport;
