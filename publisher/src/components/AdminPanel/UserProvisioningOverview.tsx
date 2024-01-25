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

import { Button } from "@justice-counts/common/components/Button";
import { DelayedRender } from "@justice-counts/common/components/DelayedRender";
import { Modal } from "@justice-counts/common/components/Modal";
import { showToast } from "@justice-counts/common/components/Toast";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";

import { useStore } from "../../stores";
import AdminPanelStore from "../../stores/AdminPanelStore";
import { Loading } from "../Loading";
import {
  AgencyProvisioning,
  Environment,
  Setting,
  SettingType,
  UserKey,
  UserProvisioning,
  UserWithAgenciesByID,
} from ".";
import * as Styled from "./AdminPanel.styles";
import { gateToAllowedEnvironment } from "../../utils/featureFlags";

export const UserProvisioningOverview = observer(() => {
  const { adminPanelStore, api } = useStore();
  const {
    loading,
    users,
    usersByID,
    updateEmail,
    updateUsername,
    updateUserAgencies,
    updateUserAccountId,
    resetUserProvisioningUpdates,
    resetAgencyProvisioningUpdates,
    deleteUser,
  } = adminPanelStore;

  const [selectedUserID, setSelectedUserID] = useState<string | number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSecondaryModal, setActiveSecondaryModal] =
    useState<SettingType>();
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    user?: UserWithAgenciesByID;
  }>({ show: false });

  const [searchInput, setSearchInput] = useState<string>("");

  const searchByKeys = ["name", "email", "id"] as UserKey[];
  const filteredUsers = AdminPanelStore.searchList(
    users,
    searchInput,
    searchByKeys
  );

  const openModal = () => setIsModalOpen(true);
  const openSecondaryModal = () => setActiveSecondaryModal(Setting.AGENCIES);
  const closeModal = (resetSearchInput?: boolean) => {
    if (!activeSecondaryModal) {
      resetUserProvisioningUpdates();
      setSelectedUserID(undefined);
      setIsModalOpen(false);
    } else {
      resetAgencyProvisioningUpdates();
      setActiveSecondaryModal(undefined);
    }
    if (resetSearchInput) {
      setSearchInput("");
    }
  };
  const searchAndFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  /**
   * Note: when a user is selected, we are in the context of editing a user.
   * When there is no user selected, we are in the context of creating a new user.
   */
  const editUser = (userID: string | number) => {
    const selectedUser = usersByID[userID][0];
    setSelectedUserID(userID);
    updateUserAccountId(+userID);
    updateEmail(selectedUser.email);
    updateUsername(selectedUser.name);
    updateUserAgencies(Object.keys(selectedUser.agencies).map((id) => +id));
    openModal();
  };
  const handleDeleteUser = async (userID: string | number) => {
    setDeleteConfirmation({ show: false });
    const response = (await deleteUser(String(userID))) as Response;

    if (response.status === 200) {
      showToast({
        message: `${usersByID[userID][0].name} has been deleted.`,
        check: true,
      });
      return;
    }
    showToast({
      message: `${usersByID[userID][0].name} could not be deleted. Please reach out to a Recidiviz team member for assistance.`,
      color: "red",
      timeout: 3500,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isModalOpen && (
        <>
          <Modal>
            <UserProvisioning
              closeModal={closeModal}
              selectedIDToEdit={selectedUserID}
              activeSecondaryModal={activeSecondaryModal}
              openSecondaryModal={openSecondaryModal}
            />
          </Modal>

          {/* Opens a secondary modal to create a new agency while in the middle of the create/edit user flow */}
          {activeSecondaryModal === Setting.AGENCIES && (
            <DelayedRender delay={250}>
              <Modal>
                <AgencyProvisioning
                  closeModal={closeModal}
                  activeSecondaryModal={activeSecondaryModal}
                />
              </Modal>
            </DelayedRender>
          )}
        </>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteConfirmation.show && (
        <Modal
          modalType="alert"
          title={`Are you sure you want to delete ${deleteConfirmation.user?.name}?`}
          description="This action cannot be undone."
          buttons={[
            {
              label: "Cancel",
              onClick: () => {
                setDeleteConfirmation({ show: false });
              },
            },
            {
              label: "Yes, delete user",
              onClick: () => {
                if (deleteConfirmation.user) {
                  handleDeleteUser(deleteConfirmation.user.id);
                }
              },
            },
          ]}
          centerText
        />
      )}

      {/* Settings Bar */}
      <Styled.SettingsBar>
        {/* Search */}
        <Styled.InputLabelWrapper inputWidth={400}>
          <input
            id="search-users"
            name="search-users"
            type="text"
            value={searchInput}
            onChange={searchAndFilter}
          />
          <Styled.LabelWrapper>
            <label htmlFor="search-users">
              Search by name, email or user ID
            </label>
            {searchInput && (
              <Styled.LabelButton
                onClick={() => {
                  setSearchInput("");
                }}
              >
                Clear
              </Styled.LabelButton>
            )}
          </Styled.LabelWrapper>
        </Styled.InputLabelWrapper>

        {/* Create User Button */}
        <Styled.ButtonWrapper>
          <Button label="Create User" onClick={openModal} buttonColor="blue" />
        </Styled.ButtonWrapper>
      </Styled.SettingsBar>

      {/* List of Users */}
      <Styled.CardContainer>
        {filteredUsers.length === 0
          ? "No users found"
          : filteredUsers.map((user) => {
              const userAgencies =
                AdminPanelStore.objectToSortedFlatMappedValues(user.agencies);
              return (
                <Styled.Card key={user.id} onClick={() => editUser(user.id)}>
                  <Styled.TopCardRowWrapper>
                    <Styled.NameSubheaderWrapper>
                      <Styled.Name>{user.name}</Styled.Name>
                      <Styled.Email>{user.email}</Styled.Email>
                    </Styled.NameSubheaderWrapper>
                    <Styled.ID>ID {user.id}</Styled.ID>
                  </Styled.TopCardRowWrapper>
                  <Styled.AgenciesWrapper>
                    {userAgencies.map((agency) => (
                      <Styled.Chip key={agency.id}>{agency.name}</Styled.Chip>
                    ))}
                  </Styled.AgenciesWrapper>
                  <Styled.NumberOfAgencies>
                    {userAgencies.length} agencies
                  </Styled.NumberOfAgencies>
                  {/* Delete Users Button */}
                  {/* TODO(#1156) - Ungate feature */}
                  {gateToAllowedEnvironment(api.environment, [
                    Environment.LOCAL,
                    Environment.STAGING,
                  ]) && (
                    <Styled.TrashIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmation({ show: true, user });
                      }}
                    />
                  )}
                </Styled.Card>
              );
            })}
      </Styled.CardContainer>
    </>
  );
});
