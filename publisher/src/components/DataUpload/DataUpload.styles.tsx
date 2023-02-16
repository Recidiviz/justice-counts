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
  HEADER_BAR_HEIGHT,
  NEW_DESKTOP_WIDTH,
  NEW_TABLET_WIDTH,
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

import { rem } from "../../utils";
import { OpacityGradient } from "../Forms";
import { PageTitle, TabbedBar } from "../Reports";

export const DataUploadContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  margin-top: -${HEADER_BAR_HEIGHT}px;
  overflow-y: scroll;
  z-index: 5;
  background: ${palette.solid.white};

  a,
  a:visited {
    color: ${palette.solid.blue};
    text-decoration: none;
    transition: 0.2s ease;
  }

  a:hover {
    color: ${palette.solid.darkblue};
    cursor: pointer;
  }
`;

export const DataUploadHeader = styled.div<{
  transparent?: boolean;
  isBackgroundBlue?: boolean;
}>`
  width: 100%;
  z-index: 1;
  height: ${HEADER_BAR_HEIGHT}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  padding-right: 24px;
  ${({ transparent }) =>
    !transparent &&
    `
      background: ${palette.solid.white};
      border-bottom: 1px solid ${palette.highlight.grey3};
    `}

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    background-color: ${({ isBackgroundBlue }) =>
      isBackgroundBlue && palette.solid.blue};
  }
`;

export const MediumPageTitle = styled(PageTitle)`
  font-size: ${rem("50px")};
`;

export const Instructions = styled.div`
  height: 100%;
  padding: 103px;
  display: flex;
  width: 50%;
  flex-direction: column;
  ${typography.sizeCSS.medium}

  h1 {
    ${typography.sizeCSS.title}
  }

  h2 {
    ${typography.sizeCSS.large}
    margin: 15px 0;
  }

  h3 {
    ${typography.sizeCSS.large}
    font-size: ${rem("22px")};
    color: ${palette.highlight.grey10};
    margin-top: 15px;
  }

  h1,
  h2,
  h3 {
    text-transform: capitalize;
  }

  ol,
  ul,
  p {
    margin: 10px 0;
  }

  ol,
  ul {
    line-height: 1.8rem;
  }

  li {
    margin-left: 50px;
  }

  li ul {
    margin: 0;
  }

  table {
    max-width: 50%;
    width: max-content;
    margin: 15px 0;
    text-align: left;
    border: 0.5px solid black;
    border-spacing: 0;
    ${typography.sizeCSS.normal};
  }

  thead {
    background: ${palette.highlight.grey2};
  }

  th,
  td {
    border: 0.5px solid black;
    padding: 5px 20px;
  }

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    width: 100%;
    padding: 100px 24px 103px 24px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 13px 0;
`;

export const ErrorWarningButtonWrapper = styled(ButtonWrapper)`
  width: 100%;
  justify-content: space-between;

  div:not(:last-child) {
    background: transparent;
    border: 1px solid ${palette.highlight.grey4};
    border-radius: 4px;

    &:hover {
      background: ${palette.highlight.grey2};
    }
  }

  div:last-child {
    background: ${palette.solid.blue};
    color: ${palette.solid.white};

    &:hover {
      opacity: 0.9;
    }
  }
`;

export type ButtonTypes =
  | "light-border"
  | "border"
  | "borderless"
  | "blue"
  | "red";

export const Button = styled.div<{ type?: ButtonTypes }>`
  ${typography.sizeCSS.normal};
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 3px;
  gap: 16px;
  text-transform: capitalize;

  ${({ type }) => {
    if (type === "light-border") {
      return `
        background: none;
        border: 1px solid ${palette.solid.white};
        color: ${palette.solid.white};
        border-radius: 4px;
      `;
    }
    if (type === "border") {
      return `
        border: 1px solid ${palette.highlight.grey4};
        border-radius: 4px;
      `;
    }
    if (type === "borderless") {
      return `
        background: none;
        color: ${palette.highlight.grey10};
      `;
    }
    if (type === "blue") {
      return `
        background: ${palette.solid.blue};
        color: ${palette.solid.white};
      `;
    }
    if (type === "red") {
      return `
        background: ${palette.solid.red};
        color: ${palette.solid.white};
      `;
    }
    return `
      background: ${palette.highlight.grey1};
      color: ${palette.highlight.grey10};
    `;
  }}

  &:hover {
    cursor: pointer;
    ${({ type }) => {
      if (type === "border") {
        return `background: ${palette.highlight.grey1};`;
      }
      if (type === "borderless") {
        return `opacity: 0.8;`;
      }
      if (type === "blue" || type === "red") {
        return `opacity: 0.9;`;
      }
      return `background: ${palette.highlight.grey2};`;
    }};
  }

  a {
    ${typography.sizeCSS.small};
    width: fit-content;
    text-decoration: none;
    color: ${palette.solid.blue};
    display: flex;
    align-items: center;
  }
`;

export const DownloadTemplateBox = styled.a`
  ${typography.sizeCSS.normal};
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 3px;
  gap: 16px;
  text-transform: capitalize;
  background: none;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 4px;

  &:hover {
    background: ${palette.highlight.grey1};
  }
`;

export const DownloadTemplateSystem = styled.div`
  color: ${palette.solid.darkgrey};

  span {
    ${typography.sizeCSS.small};
    display: block;
    width: fit-content;
    text-decoration: none;
    color: ${palette.solid.blue};
  }
`;

export const UploadButtonLabel = styled.label`
  display: inline-block;
  border-bottom: 1px solid ${palette.solid.white};

  &:hover {
    cursor: pointer;
  }
`;

export const UploadButtonInput = styled.input`
  display: none;
`;

export const DropdownItemUploadInput = styled.input`
  display: none;
`;

export const Icon = styled.img<{ grayscale?: boolean }>`
  width: 16px;
  aspect-ratio: auto;
  margin-left: 10px;
  ${({ grayscale }) => grayscale && `filter: grayscale(1);`}
`;

export const UploadFileContainer = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`;

// TODO find a way to make only fixed container shrink
export const DragDropContainer = styled.div<{ dragging?: boolean }>`
  height: 100vh;
  position: fixed;
  right: 0;
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
  justify-content: center;
  background: ${({ dragging }) =>
    dragging ? palette.solid.darkblue : palette.solid.blue};
  color: ${palette.solid.white};

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    position: fixed;
    height: ${HEADER_BAR_HEIGHT}px;
    top: 0;
    left: 64px;
    width: calc(100% - 190px);
    z-index: 2;
    flex-direction: row;
    padding: 0 10px;

    div {
      ${typography.sizeCSS.normal};
      flex-direction: row;
      gap: 8px;
    }
  }

  @media only screen and (max-width: ${NEW_TABLET_WIDTH}px) {
    div {
      ${typography.sizeCSS.small};
      flex-direction: column;
      gap: 4px;
      align-items: start;
    }
  }
`;

export const DragDropIcon = styled.img`
  margin-bottom: 15px;

  @media only screen and (max-width: ${NEW_DESKTOP_WIDTH}px) {
    margin-bottom: 0;
    margin-right: 12px;
    height: 22.5px;
    width: 22.5px;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${HEADER_BAR_HEIGHT + 80}px;
  padding-bottom: 80px;
`;

export const Wrapper = styled.div`
  width: 100%;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const Title = styled.div`
  ${typography.sizeCSS.title};
`;

export const ErrorWarningDescription = styled.div`
  ${typography.sizeCSS.medium};
  margin: 8px 0;

  span {
    text-transform: capitalize;
  }
`;

export const MessagesContainer = styled.div`
  width: 100%;
  margin-top: 19px;
`;

export const Message = styled.div`
  border-top: 1px solid ${palette.highlight.grey4};
`;

export const SectionHeader = styled.div`
  ${typography.sizeCSS.title};
  margin: 10px 0;

  &:not(:first-child) {
    margin: 40px 0 10px 0;
  }
`;

export const MetricTitle = styled.div`
  ${typography.sizeCSS.large};
  display: flex;
  align-items: center;
  padding: 16px 0;
`;

export const SheetTitle = styled.div`
  ${typography.sizeCSS.medium};
  font-size: ${rem("22px")};
  padding: 0px 0 16px 0;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const MessageBody = styled.div`
  ${typography.sizeCSS.medium};
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 5px;

  svg {
    position: relative;
    top: 12px;
  }
`;

export const MessageTitle = styled.div`
  display: block;

  span {
    ${typography.sizeCSS.normal};
    color: ${palette.highlight.grey9};
    padding: 2px 10px;
    border: 1px solid ${palette.highlight.grey5};
    border-radius: 2px;
  }
`;

export const MessageSubtitle = styled.div`
  display: block;
`;

export const MessageDescription = styled.div`
  ${typography.sizeCSS.normal};
  width: 100%;
  margin: 8px 0 13px 0;
`;

export const SelectSystemOptions = styled.div`
  width: 100%;
  margin-top: 32px;
`;

export const SystemName = styled.div`
  ${typography.sizeCSS.large};
  padding: 20px 0;
  border-top: 1px solid ${palette.highlight.grey4};
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;

  &:hover {
    cursor: pointer;
    color: ${palette.solid.blue};
  }
`;

export const FileName = styled.div<{ error?: boolean }>`
  ${typography.sizeCSS.medium};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: ${({ error }) => (error ? palette.solid.red : palette.solid.green)};
`;

export const ConfirmationPageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ExtendedTabbedBar = styled(TabbedBar)`
  height: 66px;
`;

export const RedText = styled.span`
  color: ${palette.solid.red};
`;

export const OrangeText = styled.span`
  color: ${palette.solid.orange};
`;

export const StrikethroughText = styled.span`
  text-decoration: line-through;
`;

export const BlueText = styled.span`
  color: ${palette.solid.blue};
`;

export const DataUploadLoading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LoadingHeader = styled.div`
  ${typography.sizeCSS.large};
  display: flex;
  margin: 20px 0 5px 0;
  gap: 3px;
`;

export const LoadingSubheader = styled.div`
  ${typography.sizeCSS.normal};
`;

export const CheckIcon = styled.img`
  width: 16px;
  margin-right: 5px;
`;

export const ExtendedOpacityGradient = styled(OpacityGradient)`
  height: 50px;
  position: fixed;
  bottom: 0;
`;
