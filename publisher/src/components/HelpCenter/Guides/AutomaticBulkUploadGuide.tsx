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
        <pre>
          <code>sftp -P 2022 YOUR_USERNAME@sftp.justice-counts.org</code>
        </pre>
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        When you first connect, you will see the following message:
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        <pre>
          <code>
            The authenticity of host &apos;[sftp.justice-counts.org]:2022
            ([34.139.18.35]:2022)&apos; can&apos;t be established. ED25519 key
            fingerprint is SHA256:kFQiP3MtBSM4bLxM27ha1jklKtcdKraTk8xbE0gof64.
            This key is not known by any other names Are you sure you want to
            continue connecting (yes/no/[fingerprint])?
          </code>
        </pre>
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
            To see what files are currently uploaded to the SFTP server, type{" "}
            <code>ls</code>. If you are uploading for the first time, nothing
            should be listed when you run this command.
          </li>
          <li>
            If your agency reports for multiple sectors. You will have to
            provide a separate workbook for each sector. To do this, first
            navigate to the directory for the sector you want to upload for{" "}
            <code>cd {`<sector name>`}</code> (e.g <code>cd PRISONS</code>). To
            navigate back to the home directory, type <code>cd ..</code>
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
