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
import React, { useEffect, useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
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
      {vendor.name} ({vendor.url})
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
    const { addOrEditVendor, deleteVendor } = adminPanelStore;

    const [editId, setEditId] = useState<string | null>(null);
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

    const vendors = [
      { id: "1", name: "Vendor A", url: "https://vendor-a.com" },
      { id: "2", name: "Vendor B", url: "https://vendor-b.com" },
      { id: "3", name: "Vendor C", url: "https://vendor-c.com" },
      { id: "4", name: "Vendor D", url: "https://vendor-d.com" },
      { id: "5", name: "Vendor E", url: "https://vendor-e.com" },
      { id: "6", name: "Vendor F", url: "https://vendor-f.com" },
      { id: "7", name: "Vendor G", url: "https://vendor-g.com" },
      { id: "8", name: "Vendor H", url: "https://vendor-h.com" },
      { id: "9", name: "Vendor I", url: "https://vendor-i.com" },
      { id: "10", name: "Vendor J", url: "https://vendor-j.com" },
      { id: "11", name: "Vendor K", url: "https://vendor-k.com" },
      { id: "12", name: "Vendor L", url: "https://vendor-l.com" },
      { id: "13", name: "Vendor M", url: "https://vendor-m.com" },
      { id: "14", name: "Vendor N", url: "https://vendor-n.com" },
      { id: "15", name: "Vendor O", url: "https://vendor-o.com" },
      { id: "16", name: "Vendor P", url: "https://vendor-p.com" },
      { id: "17", name: "Vendor Q", url: "https://vendor-q.com" },
      { id: "18", name: "Vendor R", url: "https://vendor-r.com" },
      { id: "19", name: "Vendor S", url: "https://vendor-s.com" },
      { id: "20", name: "Vendor T", url: "https://vendor-t.com" },
    ];

    // useEffect(() => {
    //   adminPanelStore.fetchVendors();
    // });

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
                onClick={() => addOrEditVendor(nameValue, urlValue)}
                buttonColor="blue"
                disabled={!hasChanges}
              />
            </Styled.VendorsContentSection>
            <Styled.VendorsTitle>Current Vendors</Styled.VendorsTitle>
            <Styled.VendorsScrollableInnerWrapper>
              {vendors.map((vendor) => (
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
                  onRemove={() => console.log(vendor.id)}
                />
              ))}
            </Styled.VendorsScrollableInnerWrapper>
            <Styled.VendorsButtonsContainer>
              <Button label="Save" onClick={closeModal} buttonColor="blue" />
            </Styled.VendorsButtonsContainer>
          </Styled.VendorsContent>
        </Styled.VendorsWrapper>
      </Modal>
    );
  });
