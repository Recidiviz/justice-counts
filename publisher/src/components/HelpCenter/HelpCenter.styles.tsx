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

import {
  HEADER_BAR_HEIGHT,
  palette,
  TABLET_WIDTH,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { rem } from "@justice-counts/common/utils";
import styled from "styled-components/macro";

export const HelpCenterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  text-align: left;

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

export const ContentWrapper = styled.div<{ fixedGuideWidth?: boolean }>`
  ${({ fixedGuideWidth }) => fixedGuideWidth && `max-width: 555px;`}
  display: flex;
  flex-direction: column;
`;

export const NewHeader = styled.div`
  width: 100%;
  height: ${HEADER_BAR_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 1px solid ${palette.solid.offwhitenoir};
  padding-right: 50px;

  a,
  a:visited {
    ${typography.sizeCSS.normal}
    font-weight: 400;
    color: ${palette.solid.darkgrey};
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
  }
`;

export const LogoContainer = styled.div`
  width: fit-content;
  height: ${HEADER_BAR_HEIGHT}px;
  background: ${palette.solid.darkgrey};
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
`;

export const LogoImg = styled.img`
  width: 50px;
  height: 50px;
`;

export const Label = styled.div`
  font-family: "VitesseSSm";
  font-size: 18px;
  font-weight: 325;
  line-height: 24px;
  color: ${palette.solid.white};
  white-space: nowrap;
`;

export const Breadcrumbs = styled.div`
  min-width: 555px;
  display: flex;
  gap: 8px;
  margin-bottom: 48px;
`;

export const Breadcrumb = styled.div<{
  highlight: boolean;
  disabled: boolean;
}>`
  font-size: ${rem("14px")};
  font-weight: 400;
  line-height: 20px;
  border-bottom: 1px solid transparent;
  position: relative;
  color: ${({ highlight }) =>
    highlight ? palette.solid.blue : palette.highlight.grey8};

  &:not(:last-child) {
    margin-right: 12px;
  }

  &:not(:last-child)::after {
    content: "/";
    padding-left: 8px;
    position: absolute;
    border-bottom: none;
  }

  &:hover {
    ${({ disabled }) => !disabled && `cursor: pointer;`};
    border-bottom: 1px solid
      ${({ highlight, disabled }) =>
        highlight || disabled ? `transparent` : palette.highlight.grey8};
  }
`;

export const RelevantPagesWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

export const RelevantPageBox = styled.div`
  width: 269px;
  height: 100%;
  min-height: 184px;
  padding: 32px 24px;
  border: 1px solid ${palette.highlight.grey3};
  border-radius: 4px;

  &:hover {
    cursor: pointer;
    background: ${palette.highlight.grey1};
  }
`;

export const RelevantPageBoxTitle = styled.div`
  ${typography.sizeCSS.normal}
  margin: 8px 0;
`;

export const RelevantPageBoxDescription = styled.div`
  ${typography.sizeCSS.normal}
  font-weight: 400;
`;

export const Title = styled.h1`
  ${typography.sizeCSS.large};
  margin-bottom: 8px;
`;

export const Caption = styled.p`
  font-size: ${rem("14px")};
  font-weight: 400;
  line-height: 22px;
  color: ${palette.highlight.grey8};
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  ${typography.sizeCSS.normal}
  margin-bottom: 8px;
`;

export const SectionWrapper = styled.div`
  margin-bottom: 56px;
  display: flex;
  flex-direction: column;

  li {
    margin-left: 26px;
  }

  ol,
  ul {
    margin-top: 6px;
  }

  pre {
    background: #f5f2f0;
    padding: 16px;
    overflow: auto;

    code {
      color: black;
      text-shadow: 0 1px white;
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      font-size: 0.8em;
      text-align: left;
      white-space: pre-wrap;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;
      line-height: 1.5;
      tab-size: 4;
      hyphens: none;

      span {
        display: block;
      }
    }
  }

  code:not(pre > code) {
    background: #f5f2f0;
    padding: 3px 6px;
  }
`;

export const SectionParagraph = styled.div`
  ${typography.sizeCSS.normal}
  line-height: 24px;
  font-weight: 400;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

export const BlueText = styled.span`
  color: ${palette.solid.blue};
`;

export const HelpCenterHome = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 27px;

  @media only screen and (max-width: ${TABLET_WIDTH}px) {
    align-items: center;
  }
`;

export const HomeTitle = styled.div`
  ${typography.sizeCSS.title}
`;

export const GuideLinks = styled.div`
  height: 100%;
  max-width: 1122px;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;

  @media only screen and (max-width: ${TABLET_WIDTH}px) {
    justify-content: center;
  }
`;

export const GuideLinksWrapper = styled.div`
  ${typography.sizeCSS.normal}
  width: 318px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  background: ${palette.solid.white};
  border-top: 1px solid ${palette.solid.lightgrey4};
  border-radius: 0 0 4px 4px;
  padding: 24px;
`;

export const GuideLinksTitle = styled.div``;

export const TitleLinkWrapper = styled.div`
  height: 340px;
  display: flex;
  align-items: flex-end;
  background: ${palette.solid.lightgrey2};
  border: 1px solid ${palette.solid.lightgrey4};
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  transition: background 0.2s ease-in-out;

  img {
    width: 250px;
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0 auto;
    transition: 0.2s ease-in-out;
  }
`;

export const GuideLink = styled.div`
  width: fit-content;
  font-weight: 400;
  color: ${palette.highlight.grey8};
  border-bottom: 1px solid ${palette.highlight.grey3};

  &:hover {
    cursor: pointer;
    border-bottom: 1px solid ${palette.highlight.grey8};
  }
`;

export const InterstitialContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

export const InterstitialButtonContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-top: 32px;

  @media only screen and (max-width: ${TABLET_WIDTH}px) {
    flex-direction: column;
  }
`;

export const InterstitialButtonContainer = styled.div<{ hasPath: boolean }>`
  width: 437px;
  height: 367px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  background: ${palette.solid.lightgrey2};
  border: 1px solid ${palette.solid.lightgrey4};
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  transition: background 0.2s ease-in-out;

  img {
    position: absolute;
    top: 32px;
    left: 32px;
    transition: 0.2s ease-in-out;
  }

  &:hover {
    ${({ hasPath }) => hasPath && `cursor: pointer;`}
    background: ${palette.solid.lightgrey5};

    img {
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
      top: 24px;
      left: 24px;
    }
  }
`;

export const TitleCaptionWrapper = styled.div`
  width: 100%;
  max-height: 120px;
  position: relative;
  background: ${palette.solid.white};
  border-top: 1px solid ${palette.solid.lightgrey4};
  border-radius: 0 0 4px 4px;
  padding: 24px;
`;

export const ButtonTitle = styled.div``;

export const ButtonCaption = styled.div``;

export const VideoWrapper = styled.div`
  height: 0;
  position: relative;
  padding-bottom: 56.25%;
`;

export const VideoIFrame = styled.iframe`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const Thumbnail = styled.img`
  width: 461px;
`;

export const Image = styled.img<{ align?: "left" | "center" | "right" }>`
  ${({ align }) => {
    if (align === "center") {
      return `margin: 0 auto;`;
    }
    if (align === "right") {
      return `margin-left: auto;`;
    }
    if (align === "left") {
      return `margin-right: auto;`;
    }
  }};
`;
