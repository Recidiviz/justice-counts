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

import { Button } from "@justice-counts/common/components/Button";
import { Modal } from "@justice-counts/common/components/Modal";
import { validateAgencyURL } from "@justice-counts/common/utils";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import * as Styled from "./AdminPanel.styles";
import { Vendor } from "./types";

type VendorManagementModalProps = {
  closeModal: () => void;
};

const VendorItem = ({
  vendor,
  onEdit,
  onRemove,
}: {
  vendor: Vendor;
  onEdit: () => void;
  onRemove: () => void;
}) => {
  const [showEditPrompts, setShowEditPrompts] = useState(false);

  return (
    <Styled.VendorsListItem
      onMouseEnter={() => setShowEditPrompts(true)}
      onMouseLeave={() => setShowEditPrompts(false)}
    >
      <Styled.VendorsInfo>
        {vendor.name} ({vendor.url})
      </Styled.VendorsInfo>
      <Styled.VendorsEditPrompts>
        {showEditPrompts && (
          <>
            <Styled.VendorsEditButton onClick={onEdit}>
              Edit
            </Styled.VendorsEditButton>
            <Styled.VendorsEditButton isRemove onClick={onRemove}>
              Remove
            </Styled.VendorsEditButton>
          </>
        )}
      </Styled.VendorsEditPrompts>
    </Styled.VendorsListItem>
  );
};

export const VendorManagementModal: React.FC<VendorManagementModalProps> =
  observer(({ closeModal }) => {
    const { adminPanelStore } = useStore();
    const { vendors, addOrEditVendor, deleteVendor } = adminPanelStore;

    const sortedVendors = vendors.slice().sort((a, b) => b.id - a.id);

    const [editId, setEditId] = useState<number | undefined>(undefined);
    const [nameValue, setNameValue] = useState("");
    const [urlValue, setUrlValue] = useState("");
    const [editNameValue, setEditNameValue] = useState("");
    const [editlUrlValue, setEditUrlValue] = useState("");
    const [urlValidationError, setUrlValidationError] = useState<
      string | undefined
    >(undefined);

    const validateAndUpdateURL = (url: string) => {
      const isValidURL = validateAgencyURL(url);
      setUrlValue(url);

      if (url === "" || isValidURL) {
        return setUrlValidationError(undefined);
      }
      setUrlValidationError("Invalid URL format");
    };

    const handleClearVendorInfo = () => {
      setEditId(undefined);
      setNameValue("");
      setUrlValue("");
      setEditNameValue("");
      setEditUrlValue("");
    };

    // Determine if the "Add/Update" button should be enabled
    const hasValues = Boolean(nameValue) && Boolean(urlValue);
    const hasChanges =
      hasValues &&
      !urlValidationError &&
      (nameValue !== editNameValue || urlValue !== editlUrlValue); // Changes detected in "Update" mode

    return (
      <Modal>
        <Styled.VendorsWrapper>
          <Styled.VendorsContent>
            <Styled.VendorsHeader>
              Vendors
              <Styled.VendorsCloseButton onClick={closeModal}>
                &#10005;
              </Styled.VendorsCloseButton>
            </Styled.VendorsHeader>
            <Styled.VendorsContentSection>
              <Styled.InputLabelWrapper>
                <input
                  id="vendor-name"
                  name="vendor-name"
                  type="text"
                  maxLength={750}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                />
                <label htmlFor="vendor-name">Enter vendor name</label>
              </Styled.InputLabelWrapper>
              <Styled.InputLabelWrapper hasError={Boolean(urlValidationError)}>
                <input
                  id="vendor-url"
                  name="vendor-url"
                  type="text"
                  value={urlValue}
                  onChange={(e) =>
                    validateAndUpdateURL(e.target.value.trimStart())
                  }
                />
                <Styled.LabelWrapper>
                  <label htmlFor="agency-url">Enter vendor URL</label>
                  {urlValidationError && (
                    <Styled.ErrorLabel>{urlValidationError}</Styled.ErrorLabel>
                  )}
                </Styled.LabelWrapper>
              </Styled.InputLabelWrapper>
              <Button
                label={editId ? "Update" : "Add"}
                onClick={() => {
                  addOrEditVendor(nameValue, urlValue, editId);
                  handleClearVendorInfo();
                }}
                buttonColor="blue"
                disabled={!hasChanges}
              />
              &emsp;
              <Button
                label="Clear"
                onClick={() => handleClearVendorInfo()}
                buttonColor="blue"
                disabled={!hasValues}
              />
            </Styled.VendorsContentSection>
            <Styled.VendorsTitle>Current Vendors</Styled.VendorsTitle>
            <Styled.VendorsScrollableInnerWrapper>
              {sortedVendors.map((vendor) => (
                <VendorItem
                  key={vendor.id}
                  vendor={vendor}
                  onEdit={() => {
                    setEditId(vendor.id);
                    setNameValue(vendor.name);
                    setUrlValue(vendor.url);
                    setEditNameValue(vendor.name);
                    setEditUrlValue(vendor.url);
                  }}
                  onRemove={() => deleteVendor(vendor.id)}
                />
              ))}
            </Styled.VendorsScrollableInnerWrapper>
            <Styled.VendorsButtonsContainer>
              <Button label="Close" onClick={closeModal} buttonColor="blue" />
            </Styled.VendorsButtonsContainer>
          </Styled.VendorsContent>
        </Styled.VendorsWrapper>
      </Modal>
    );
  });
