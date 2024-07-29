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

import React from "react";

import * as Styled from "../HelpCenter.styles";
import { LinkToPublisher } from "../LinkToPublisherDashboard";

export const AutomatedBulkUploadGuide = () => (
  <>
    <Styled.SectionWrapper>
      <Styled.SectionParagraph>
        Automated Data Upload is a feature that allows you to upload data to
        Justice Counts with the{" "}
        <LinkToPublisher publisherPath="upload">
          bulk upload format
        </LinkToPublisher>{" "}
        without logging in to Publisher. This is done using Secure File Transfer
        Protocol (SFTP), which is a secure way to transfer files over a network.
        This can be done through the following steps:
        <ol>
          <li>
            Export your data as a CSV or Excel file in the Justice Counts bulk
            upload format.{" "}
          </li>
          <li>
            Use Secure File Transfer Protocol (SFTP) to upload your file to our
            server. To initiate this process, please contact{" "}
            <a
              href="mailto:justice-counts-support@csg.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              justice-counts-support@csg.org
            </a>
            .
          </li>
          <li>
            Optionally, create a script to automate steps 1 and 2 to upload data
            at a regular cadence.
          </li>
        </ol>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>

    <Styled.SectionWrapper>
      <Styled.SectionTitle>SFTP Process</Styled.SectionTitle>
      <Styled.SectionParagraph>
        Secure File Transfer Protocol (SFTP) allows you to transfer data with a
        high level of security. To begin the process, contact us at{" "}
        <a
          href="mailto:justice-counts-support@csg.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          justice-counts-support@csg.org
        </a>{" "}
        to request a username and password for our SFTP server. Once we have
        confirmed that your account has been created, run the following command
        from your command line to connect to our SFTP server.
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
        Our server is secure, so type yes to connect.
      </Styled.SectionParagraph>
      <Styled.SectionParagraph>
        <ol>
          <li>
            When prompted for your password, enter the password provided for you
            in step 1.
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
            navigate back to the home directory, type <code>cd ..</code>.
          </li>
          <li>
            Run <code>put {`<path to file>`}</code> to upload a file. The file
            path that you are uploading must be absolute. For example, if your
            file <code>data.xlsx</code> is in the Documents folder, the path
            should not be <code>~/Documents/file.xlsx</code>, but rather{" "}
            <code>/Users/JohnDoe/Documents/file.xlsx</code>.
          </li>
          <li>
            To leave sftp, type <code>exit</code>.
          </li>
          <li>
            Once you have uploaded a file, you will receive a confirmation
            email.
          </li>
        </ol>
      </Styled.SectionParagraph>
    </Styled.SectionWrapper>
  </>
);
