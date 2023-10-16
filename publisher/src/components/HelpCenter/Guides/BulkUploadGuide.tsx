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

import * as Styled from "../HelpCenter.styles";

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
        As an alternative to uploading an Excel workbook with multiple pages, a
        Single Page Upload template is also available. If you choose to upload a
        Single Page template, the metric column is required to distinguish which
        metric a given row in the file is associated with. Additionally, each
        row in the file that contains data for an aggregate metric must have
        empty cells in the breakdown_category and breakdown columns.
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
      <Styled.SectionTitle>Breakdown Column</Styled.SectionTitle>
      <Styled.SectionParagraph>
        If the metric asks you to break the value down into different categories
        (e.g. separating out crimes by offense type), our system expects a sheet
        that includes a column with the name of the category (e.g.
        offense_type). Each row should specify a different value for that
        category (e.g. person, property, drug). Your example file will contain
        the expected naming conventions for breakdown sheets and columns. Please
        only provide valid category names (as seen in your example file) for
        breakdown columns. If your agency categorizes the metric differently,
        group any unmatched data into the Other category. For example, a sheet
        for reported_crimes_by_type might look like this:
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>[Import screenshot]</Styled.SectionParagraph>
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
        If you are sharing data for multiple agencies, you should also add a
        column to each sheet titled agency. The value of this column should be
        the name of the agency to which that row belongs. For instance:
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>[Import screenshot]</Styled.SectionParagraph>
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
      <Styled.VideoWrapper>
        <Styled.VideoIFrame
          src="https://www.loom.com/embed/292521d0292b42d4a3710b78cd73f6af?sid=21f2da86-32e1-40c4-92be-fdfef77454bc"
          title="Loom Video"
        />
      </Styled.VideoWrapper>
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
      <Styled.SectionParagraph>[Import screenshot]</Styled.SectionParagraph>
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
      <Styled.VideoWrapper>
        <Styled.VideoIFrame
          src="https://www.loom.com/embed/10346f8af112475d9816d253a9b2bad2?sid=fcad2e79-0600-4638-b241-913daeb57163"
          title="Loom Video"
        />
      </Styled.VideoWrapper>
    </Styled.SectionWrapper>
  </>
);
