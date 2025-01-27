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

import {
  CustomDropdown,
  CustomDropdownMenu,
  CustomDropdownMenuItem,
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
`;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  ${typography.bodyEmphasized};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  margin-top: 48px;
`;

export const Description = styled.div`
  ${typography.body};
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${palette.highlight.grey8};
  margin-bottom: 48px;
`;

export const MetricSettingsSectionTitle = styled.div`
  ${typography.sizeCSS.title};
  margin-bottom: 16px;
`;

export const SettingsContainer = styled.div<{ borderTop?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  ${({ borderTop }) =>
    borderTop && `border-top: 1px solid ${palette.solid.lightgrey4};`}
`;

export const Setting = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 48px;
`;

export const SettingName = styled.div`
  ${typography.body};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
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
  bottom: 0px;
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

export const DropdownV2Container = styled.div<{
  checked?: boolean;
  marginTop?: boolean;
}>`
  width: 275px;
  display: flex;
  flex: 1 1 0;
  border-radius: 3px;
  ${({ marginTop }) => marginTop && "margin-top: 8px;"};

  & ${CustomDropdown} {
    border: 1px solid ${palette.highlight.grey4};
    border-radius: 3px;
  }

  & ${CustomDropdownToggle} {
    padding: 8px 16px;
  }

  & ${CustomDropdownToggleLabel} {
    ${typography.body}
    text-transform: capitalize;
    gap: 8px;
  }

  & ${CustomDropdownMenu} {
    max-height: calc(55px * 4);
    box-shadow: none;
    border: 1px solid ${palette.highlight.grey4};
    margin-top: 8px;
  }

  & ${CustomDropdownMenuItem} {
    ${typography.body}
    border: none;
    padding: 12px 16px;
  }
`;

export const LeftAlignedButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const BreakdownsSection = styled.div<{ disabled: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  padding-top: 48px;
  border-top: 1px solid ${palette.solid.lightgrey4};

  ${({ disabled }) => disabled && "pointer-events: none; opacity: 0.5"};
`;

export const BreakdownsSectionTitle = styled(MetricSettingsSectionTitle)`
  ${typography.bodyEmphasized}
  margin-bottom: 8px;
`;

export const BreakdownsSectionDescription = styled(Description)`
  ${typography.body}
  margin-bottom: 24px;
  color: ${palette.highlight.grey8};
`;

export const BreakdownsOptionsContainer = styled.div<{
  disaggregatedBySupervisionSubsystems?: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-bottom: 32px;
  ${({ disaggregatedBySupervisionSubsystems }) =>
    disaggregatedBySupervisionSubsystems ? `margin-top: 32px` : 0};
`;

export const BreakdownsOption = styled.div<{ active: boolean }>`
  ${typography.body};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border-radius: 20px;
  text-transform: capitalize;
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

export const DimensionsContainer = styled.div<{
  isDisaggregatedBySupervisionSubsystemsSingleDisaggregation?: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 48px;
  margin-top: ${({
    isDisaggregatedBySupervisionSubsystemsSingleDisaggregation,
  }) =>
    isDisaggregatedBySupervisionSubsystemsSingleDisaggregation ? `48px` : 0};

  &:last-child {
    margin-bottom: 38px;
  }
`;

export const DimensionsHeader = styled.div`
  ${typography.body};
  display: flex;
  flex-direction: row;
  gap: 11px;
  margin-bottom: 16px;
`;

export const SelectAllDimensions = styled.span<{ disabled?: boolean }>`
  ${typography.body}
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
  padding: 8px 0;
  ${typography.sizeCSS.medium};

  ${({ enabled }) => !enabled && `color: ${palette.highlight.grey7};`}
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
