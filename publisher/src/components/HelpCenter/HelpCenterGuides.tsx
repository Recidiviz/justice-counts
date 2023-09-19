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

import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  Breadcrumbs,
  GuidesByPathnameWithKey,
  helpCenterGuideStructure,
} from ".";
import * as Styled from "./HelpCenter.styles";

export const GuideLayoutWithBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((name) => name);
  /**
   * Assumes that the pathnames will be: [<home path>, <app (publisher or dashboard)>, <specific guide>]
   * and that the path in index 1 will always be the name of the app (either `publisher` or `dashboard`)
   */
  const currentAppGuideKey = pathnames[1];
  const currentPathname = pathnames[pathnames.length - 1];
  const guidesByPathname = Object.entries(
    helpCenterGuideStructure[currentAppGuideKey].guides
  ).reduce((acc, [key, val]) => {
    acc[val.path] = { key, ...val };
    return acc;
  }, {} as GuidesByPathnameWithKey);
  const isGuideOpen = !Object.keys(helpCenterGuideStructure).includes(
    currentPathname
  );
  const currentGuide = isGuideOpen
    ? guidesByPathname[currentPathname]
    : undefined;

  return (
    <Styled.ContentWrapper>
      <Breadcrumbs pathname={location.pathname} />

      {!currentGuide ? (
        <Outlet />
      ) : (
        <>
          <Styled.Title>{currentGuide.label}</Styled.Title>
          <Styled.Caption>{currentGuide.caption}</Styled.Caption>
          <Outlet />
          <RelevantGuides
            appKey={currentAppGuideKey}
            guideKey={currentGuide.key}
          />
        </>
      )}
    </Styled.ContentWrapper>
  );
};

const RelevantGuides: React.FC<{ appKey: string; guideKey: string }> = ({
  appKey,
  guideKey,
}) => {
  const navigate = useNavigate();
  const guideKeys =
    helpCenterGuideStructure[appKey].guides[guideKey].relevantGuides;
  return (
    <>
      <Styled.SectionTitle>Relevant Pages</Styled.SectionTitle>
      <Styled.RelevantPagesWrapper>
        {guideKeys.map((key) => {
          const guide =
            helpCenterGuideStructure.publisher.guides[key] ||
            helpCenterGuideStructure.dashboard.guides[key];
          return (
            <Styled.RelevantPageBox
              key={key}
              onClick={() => navigate(`../${guide.path}`, { relative: "path" })}
            >
              <Styled.RelevantPageBoxTitle>
                {guide.label}
              </Styled.RelevantPageBoxTitle>
              <Styled.RelevantPageBoxDescription>
                {guide.caption}
              </Styled.RelevantPageBoxDescription>
            </Styled.RelevantPageBox>
          );
        })}
      </Styled.RelevantPagesWrapper>
    </>
  );
};

export const ExploreDataGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        The Explore Data tab allows you to visualize the data you have uploaded
        into Publisher. It displays both draft and published data.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Click <Styled.BlueText>Explore Data</Styled.BlueText>, the fourth item
        on the navigation bar, to reach this page.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Interacting with the Data</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Metric data can be viewed in both chart or table form. The time period
        reflected in the chart is adjustable through the drop-downs, and
        breakdown information may be displayed if provided. The chart is
        downloadable as a PNG.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Toggling between Metrics</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Select a preferred metric from the list on the left of the screen. Only
        the metrics that you have set as available will be presented. To show
        additional metrics, adjust their availability within Metric Settings
        (link to other part of tutorial). If your agency belongs to multiple
        sectors, each sector will be presented with its own individual metrics.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

export const AccountSetupGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Within agency settings you can update information about your agency
        including your URL and the description of your agency.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        {`{Screenshot of jurisdictions}`} You may also edit the jurisdictions
        that your agency covers and specify areas included and excluded.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        If you need to update your agency name, state, or sector, please contact
        justice-counts-support@csg.org.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

export const SetUpMetricsGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        The <strong>Set Up Metrics</strong> page allows you to customize the
        Justice Counts metrics based on whether or not you are able to share
        data for the metric, the frequency in which you record the data, and how
        your agency defines and breaks down the metric.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Click on Set Up Metrics in the top navigation bar, then click on a
        metric to set up its availability, breakdown categories, and
        definitions.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Availability</Styled.SectionTitle>
      <Styled.SectionParagraph>
        For each metric, you can indicate whether or not you are able to share
        data. If you are able to share data for the metric, you will need to
        specify the frequency the data is recorded (monthly or annually).
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you&apos;ve clicked on a metric from the{" "}
        <strong>Set Up Metrics</strong> overview page, look for the{" "}
        <strong>Availability</strong> section under the{" "}
        <strong> Set metric availability &rarr; Metric</strong> headings. If you
        are not able to share data for the metric, click the{" "}
        <strong>Not Available</strong> button. If you are able to share data for
        the metric, click on the <strong>Monthly</strong> button if this metric
        is recorded/shared monthly, or click on the <strong>Annually</strong>{" "}
        button (and specify which month the counting year starts) if this metric
        is recorded/shared annually.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Breakdowns</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Some metrics contain breakdown categories that help further define what
        makes up the overall metric. For example, a <strong>Staff</strong>{" "}
        metric could be broken down into{" "}
        <strong>
          Security Staff, Management Staff, Clinical Staff, Other Staff
        </strong>{" "}
        all of which can be turned on and off depending on whether or not they
        are included in your overall definition of the metric.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you&apos;ve clicked on a metric from the{" "}
        <strong>Set Up Metrics</strong> overview page, look for the{" "}
        <strong>Metric Breakdowns</strong> section under the{" "}
        <strong>Set metric availability</strong> heading. Click on the toggle to
        the left of a breakdown category to toggle a breakdown on/off indicating
        whether or not it is part of your recorded data for the overall metric.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Set Metric Definitions</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Metric definitions allow you to get even more specific with your
        definition of a metric providing you with more flexibility to align the
        Justice Counts metrics with how your agency uniquely records data. You
        will be able to specify which categories are included or excluded in a
        metric or breakdown if your description of a metric or breakdown do not
        align entirely with the Justice Counts preferred definitions.
        Additionally, there&apos;s an option to describe additional data
        elements within a free-form textbox if the provided categories do not
        fully capture your agency&apos;s metric definition.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Once you&apos;ve clicked on a metric from the{" "}
        <strong>Set Up Metrics</strong> overview page, click on{" "}
        <strong>Define metrics</strong> on the left side menu. Click on a
        Primary Metric or its breakdowns to view and edit its definition. You
        can click on <strong>choose the Justice Counts definition</strong> to
        automatically select the standard Justice Counts definition for the
        metric/breakdown. Or, you can specify each definition individually by
        clicking on the toggles to the left of each category to indicate whether
        that definition category is included or excluded from the overall
        definition of a metric or its breakdown(s). You can also enter text in
        the free-form textbox if the categories do not adequately describe the
        metric/breakdown. Click <strong>Save</strong>
        to save your changes.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

export const ManualEntryGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Using manual entry, you can enter data for specified time periods,
        organized as records.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Edit an existing record</Styled.SectionTitle>
      <Styled.SectionParagraph>
        For metrics with a monthly availability, choose or create a record for
        the month and year for which you want to enter data. For metrics with an
        annual availability, choose or create a record for the year, ensuring
        the correct starting month is specified. Each record allows you to input
        information for all metrics that have availability set for the specified
        time period.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Creating a new record</Styled.SectionTitle>
      <Styled.SectionParagraph>
        To create a new record, click the create record button in the top right
        corner. Then, specify the reporting period (either month or year) and
        the starting period for the record. Next, click create record. The
        record will be populated with metrics that have the matching
        availability.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

export const BulkUploadGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Upload and publish data for multiple records at once using excel or csv
        files to expedite data sharing.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        The Bulk Upload feature allows you to upload and publish data for
        multiple metrics and time periods at once. Users prepare excel or csv
        files containing data for metrics and time periods of interest, and
        upload those files via the Uploads page. This feature is an alternative
        to Manual Entry, as Manual Entry only allows for one record to be
        uploaded at one time.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        Select Enter Data from the navigation bar. Select the Upload File option
        on the right to arrive on the Uploads page. Drag and drop or browse and
        select a file to upload from your computer on the right side of the
        page.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Bulk Upload Format</Styled.SectionTitle>
      <Styled.SectionParagraph>
        In order to use the Bulk Upload feature, we require that users upload
        files in a particular format. The Bulk Upload feature currently supports
        the following file types: xls, xlsx, and csv. For each file type, the
        following formats are also accepted: single page with one metric, single
        page with multiple metrics, multiple pages with multiple metrics (1 page
        per metric). More details on each of these formats can be found below.
        In addition to file type and format requirements, the Bulk Upload
        feature also requires specific columns depending on your agencies
        settings and metric settings. More details on the required columns can
        be found below.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>
        Multiple Page with Multiple Metrics (1 Page per Metric)
      </Styled.SectionTitle>
      <Styled.SectionParagraph>
        If you choose to upload an Excel workbook, include one sheet (or tab) in
        the workbook for each Justice Counts metric defined for your sector. If
        you download the multi-tab template, it will automatically only include
        tabs for metrics you have enabled. If you are uploading an Excel
        workbook, we require that each sheet is given a standard name. Refer to
        your example file (found via the Uploads page) for the valid sheet
        names.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>
        Single Page with Multiple Metrics
      </Styled.SectionTitle>
      <Styled.SectionParagraph>
        [Copy what we have in the Single Page Uploads section of the Bulk Upload
        Instructions page]
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>File Templates/Examples</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Example files can be downloaded from the Uploads page, in both single
        and multiple page formats. Note that these downloads automatically
        customize a template based on your agency’s metric settings. We
        recommend visiting the Metric Settings page and configuring all metrics
        prior to downloading these templates.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Expected Columns</Styled.SectionTitle>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Year, Month, and Value Columns</Styled.SectionTitle>
      <Styled.SectionParagraph>
        All pages are required to include <strong>year</strong> and{" "}
        <strong>value</strong> columns. Metrics that are configured to be
        reported on a monthly basis will need to include a{" "}
        <strong>month</strong> column. To share data for a metric for a
        particular time period, add a new row to the page. Fill in the
        appropriate values for the year and month columns, and enter the metric
        value in the value column. The year should be in the format 20XX. The
        month should either be a number [1 … 12] or the full month name [January
        … February]. The value should be numeric and contain no other characters
        (commas are allowed, e.g. 1,000). For example, the page should look
        roughly like this:
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>[Import screenshot]</Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Year, Month, and Value Columns</Styled.SectionTitle>
      <Styled.SectionParagraph>
        [Copy what we have in the Breakdowns section of the Bulk Upload
        Instructions page]
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Supervision System Column</Styled.SectionTitle>
      <Styled.SectionParagraph>
        If your agency is a Supervision agency that records data for other
        populations (Parole, Probation, Pretrial Supervision, Other), then each
        uploaded page should contain a system column. If you have only aggregate
        data, fill in the system column with &apos;ALL&apos;.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>[Import screenshot]</Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Superagency Agency Column</Styled.SectionTitle>
      <Styled.SectionParagraph>
        [Copy what we have in the Multiple Agencies section of the Bulk Upload
        Instructions page]
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Errors and Warnings</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Once you have uploaded a file via Bulk Upload, you may or may not see an
        Errors and Warnings page. This page will be encountered if your Bulk
        Upload file contains unexpected formatting or unexpected data based on
        your agency’s Metric Settings. The Errors and Warnings page will include
        a description of the issue(s) we encountered with your file. These
        descriptions are intended to ensure that your data is uploaded and saved
        properly. If you encounter this page, we encourage you to take these
        errors and warnings into consideration, check that your uploaded file
        and data is properly formatted, and make changes and re-upload your file
        accordingly.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Uploading Data</Styled.SectionTitle>
      <Styled.SectionParagraph>
        An example of uploading a file via Bulk Upload can be seen in the video
        below. In this example, a file was previously downloaded, filled with
        data, and saved to the user’s Desktop.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        [Video?
        https://www.loom.com/share/292521d0292b42d4a3710b78cd73f6af?sid=adc431ab-166a-4f13-ba1a-ad4a333c638d]
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Review and Publish</Styled.SectionTitle>
      <Styled.SectionParagraph>
        After you upload your file, you will encounter the Review and Publish
        page. This page gives you an opportunity to review your uploaded data,
        and make sure that the data that has been saved is what you intended.
        This page also includes information about which metrics have been
        uploaded and which Records have been changed based on your upload. Once
        you are confident in your upload, you can either Publish your data from
        this page, or opt to exit without publishing.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        [Video? https://www.loom.com/share/10346f8af112475d9816d253a9b2bad2]
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

export const AutomatedBulkUploadGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Automated Bulk Upload is a new feature that allows you to upload data to
        our system without logging in. This is done using Secure File Transfer
        Protocol (SFTP), which is a secure way to transfer files over a
        network.The files must be Excel workbooks or CSV sheets. The files must
        comply with our technical specification. You can find more information
        about the technical specification and download custom templates here
        [hyperlink to Michelle’s work].
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>Confirmation Email</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Once you have uploaded a file via this new feature, you will receive a
        confirmation email from no-reply@justice-counts.org The email will
        include information on whether or not your upload was successful. This
        email will also include a link to a review page, where you can review
        and publish your uploaded data. If your upload resulted in errors and
        warnings due to data/formatting issues, the email will also include a
        link to an errors and warnings page.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>How to use SFTP</Styled.SectionTitle>
      <Styled.SectionParagraph>
        First, contact us at [help email address] to request a username and
        password for our SFTP server. Once we have confirmed that your account
        has been created, do the following to connect to our SFTP server.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        sftp -P 2022 YOUR_USERNAME@sftp.justice-counts.org
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        When you first connect, you will see the following message:
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        The authenticity of host &apos;[sftp.justice-counts.org]:2022
        ([34.139.18.35]:2022)&apos; can&apos;t be established. ED25519 key
        fingerprint is SHA256:kFQiP3MtBSM4bLxM27ha1jklKtcdKraTk8xbE0gof64. This
        key is not known by any other names Are you sure you want to continue
        connecting (yes/no/[fingerprint])?
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        This is a standard message that your computer’s internal security system
        will show whenever you connect to an external server for the first time.
        Our server is secure, type yes to connect.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        <ol>
          <li>
            You will be prompted for your password, please enter the password
            provided for you by Justice Counts.
          </li>
          <li>
            To see what files are currently uploaded to the SFTP server, type
            ls. If you are uploading for the first time, nothing should be
            listed when you run this command.
          </li>
          <li>
            If your agency reports for multiple sectors. You will have to
            provide a separate workbook for each sector. To do this, first
            navigate to the directory for the sector you want to upload for cd{" "}
            {`<sector name>`} (e.g cd PRISONS). To navigate back to the home
            directory, type cd ..
          </li>
          <li>
            Run put {`<path to file>`} to upload a file. The file path that you
            are uploading must be absolute. For example, if your file data.xlsx
            is in the Documents folder, the path should not be
            ~/Documents/file.xlsx, but rather
            /Users/JohnDoe/Documents/file.xlsx.
          </li>
          <li>To leave sftp, type exit.</li>
        </ol>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);

export const DashboardsGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        All data shown within the Justice Counts Agency Dashboards are
        specifically published by each agency. For more information on the
        metrics shown, see
        https://justicecounts.csgjusticecenter.org/metrics/justice-counts-metrics/
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionTitle>Home Page</Styled.SectionTitle>
      <Styled.SectionParagraph>
        The agency dashboard home page provided an at-a-glance overview of all
        published metrics for a particular agency. With these previews, you can
        see general trends over time. For a more interactive view, click into
        the individual category pages.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
    <Styled.SectionWrapper>
      <Styled.SectionTitle>Category Pages</Styled.SectionTitle>
      <Styled.SectionParagraph>
        By clicking on a metric category, you enter the specific category page
        which provides a more interactive experience with the data. You can
        hover over charts to see specific values, and see breakdown values if
        published.
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
