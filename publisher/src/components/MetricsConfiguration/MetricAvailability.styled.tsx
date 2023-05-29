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
  CustomDropdown,
  CustomDropdownMenu,
  CustomDropdownToggle,
  CustomDropdownToggleLabel,
} from "@justice-counts/common/components/Dropdown";
import {
  palette,
  typography,
} from "@justice-counts/common/components/GlobalStyles";
import styled from "styled-components/macro";

export const Wrapper = styled.div`
  width: 100%;
  padding-left: 574px;
`;

export const InnerWrapper = styled.div`
  width: 754px;
  padding: 72px 0 100px 0;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const HeaderNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32.5px;
  height: 32.5px;
  margin-top: 2px;
  border: 0.5px solid ${palette.highlight.grey4};
  border-radius: 100%;
  font-family: ${typography.family};
  font-size: 16.25px;
  line-height: 22px;
  color: ${palette.solid.white};
  background-color: ${palette.solid.blue};
`;

export const HeaderLabel = styled.div`
  ${typography.sizeCSS.title};
  font-size: 42px;
`;

export const Description = styled.div`
  ${typography.sizeCSS.medium};
  color: ${palette.highlight.grey10};
  margin-bottom: 40px;
`;

export const MetricSettingsSectionTitle = styled.div`
  ${typography.sizeCSS.title};
  margin-bottom: 16px;
`;

export const SettingRowsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 64px;
`;

export const SettingRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const SettingName = styled.div`
  width: 45%;
  min-width: 45%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  ${typography.sizeCSS.medium};
`;

export const InfoIconWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const SettingTooltip = styled.div`
  display: none;
  position: absolute;
  left: 32px;
  background-color: ${palette.solid.black};
  border-radius: 3px;
  color: ${palette.solid.white};
  padding: 24px;
  width: 417px;
  max-width: 417px;
  z-index: 2;
  ${typography.sizeCSS.normal};

  ${InfoIconWrapper}:hover & {
    display: block;
  }
`;

export const MonthSelectionDropdownContainer = styled.div<{
  checked?: boolean;
}>`
  display: flex;
  flex: 1 1 0;
  border-radius: 3px;

  & ${CustomDropdown} {
    border: 1px solid ${palette.highlight.grey4};
    border-radius: 3px;
  }

  & ${CustomDropdownToggle} {
    padding: 9px 16px;
  }

  & ${CustomDropdownToggleLabel} {
    justify-content: center;
    gap: 8px;
  }

  & ${CustomDropdownMenu} {
    max-height: calc(55px * 4);
  }

  ${({ checked }) =>
    checked &&
    `
      background-color: ${palette.solid.blue};
      
      & ${CustomDropdownToggleLabel} {
        color: ${palette.solid.white};
      };
      
      &:hover {
        background-color: ${palette.solid.darkblue};
      }
    `};
`;

export const BreakdownsSection = styled.div<{ disabled: boolean }>`
  width: 100%;
  position: relative;

  ${({ disabled }) => disabled && "pointer-events: none; opacity: 0.5"};
`;

export const BreakdownsSectionTitle = styled(MetricSettingsSectionTitle)`
  margin-bottom: 8px;
`;

export const BreakdownsSectionDescription = styled(Description)`
  margin-bottom: 24px;
  color: ${palette.solid.darkgrey};
`;

export const BreakdownsOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 32px;
`;

export const BreakdownsOption = styled.div<{ active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border-radius: 20px;
  text-transform: capitalize;
  ${typography.sizeCSS.small};
  color: ${({ active }) =>
    active ? palette.solid.white : palette.solid.darkgrey};
  background-color: ${({ active }) =>
    active ? palette.solid.blue : palette.solid.offwhite};
  cursor: pointer;

  &:hover {
    background-color: ${({ active }) =>
      active ? palette.solid.darkblue : palette.highlight.grey2};
  }
`;

export const DimensionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const DimensionsHeader = styled.div`
  ${typography.sizeCSS.normal};
  display: flex;
  flex-direction: row;
  gap: 11px;
`;

export const SelectAllDimensions = styled.span<{ disabled?: boolean }>`
  display: inline-block;
  cursor: pointer;
  color: ${({ disabled }) =>
    disabled ? palette.highlight.grey8 : palette.solid.blue};
  ${({ disabled }) => disabled && "pointer-events: none"};

  &:hover {
    color: ${palette.solid.darkblue};
  }
`;

export const DimensionsList = styled.form``;

export const DimensionsListFieldset = styled.fieldset<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  border: none;
  ${({ disabled }) => disabled && "opacity: 0.6; pointer-events: none"};
`;

export const DimensionsListItem = styled.div<{ enabled?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  padding: 16px 0 16px 10px;
  border-bottom: 1px solid ${palette.highlight.grey4};
  ${typography.sizeCSS.medium};

  ${({ enabled }) => !enabled && `color: ${palette.highlight.grey7};`}
  &:last-child {
    border-bottom: none;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

export const DisabledDimensionIcon = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid ${palette.highlight.grey4};
  border-radius: 100%;
`;
