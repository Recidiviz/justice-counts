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
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import { rem } from "@justice-counts/common/utils";
import styled from "styled-components/macro";

export const HelpCenterContainer = styled.div`
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

export const ContentWrapper = styled.div`
  max-width: 555px;
  display: flex;
  flex-direction: column;
`;

export const NewHeader = styled.div`
  width: 100%;
  height: ${HEADER_BAR_HEIGHT}px;
  position: absolute;
  top: 0;
  left: 0;
  border-bottom: 1px solid ${palette.solid.offwhitenoir};
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

export const Breadcrumb = styled.div<{ highlight?: boolean }>`
  font-size: ${rem("14px")};
  font-weight: 400;
  line-height: 20px;

  color: ${({ highlight }) =>
    highlight ? palette.solid.blue : palette.highlight.grey8};

  &:not(:last-child)::after {
    content: "/";
    padding-left: 8px;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const RelevantPagesWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
`;

export const RelevantPageBox = styled.div`
  width: 269px;
  height: 184px;
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
  margin-bottom: 8px;
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

  li {
    margin-left: 16px;
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

export const SectionParagraph = styled.p`
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
  align-items: center;
  gap: 75px;
`;

export const HomeTitle = styled.div`
  ${typography.sizeCSS.title}
`;

export const GuideLinks = styled.div`
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
`;

export const GuideLinksWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const GuideLinksTitle = styled.div`
  ${typography.sizeCSS.medium}
`;

export const GuideLink = styled.div`
  ${typography.sizeCSS.normal}
  color: ${palette.solid.blue};

  &:hover {
    cursor: pointer;
    color: ${palette.solid.darkblue};
  }
`;

export const InterstitialContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

export const InterstitialButton = styled.div`
  min-width: 424px;
  min-height: 264px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.5px solid ${palette.highlight.grey4};

  &:hover {
    cursor: pointer;
    background: ${palette.highlight.grey1};
  }
`;

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