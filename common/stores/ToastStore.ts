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

import { makeAutoObservable, runInAction } from "mobx";

type ToastColor = "blue" | "red" | "grey";

type ToastParams = {
  message: string;
  check?: boolean;
  color?: ToastColor;
  timeout?: number;
  preventOverride?: boolean;
  positionNextToIcon?: boolean;
};

class ToastStore {
  message: string | undefined;

  check: boolean;

  color: ToastColor;

  timeout: number;

  preventOverride: boolean;

  positionNextToIcon: boolean;

  constructor() {
    makeAutoObservable(this);
    this.message = undefined;
    this.check = false;
    this.color = "blue";
    this.timeout = 2500;
    this.preventOverride = false;
    this.positionNextToIcon = true;
  }

  showNewToast = (params: ToastParams) => {
    if (this.message) {
      runInAction(() => {
        this.message = undefined;
      });
    }
    const {
      message,
      check,
      color,
      timeout,
      preventOverride,
      positionNextToIcon,
    } = params;
    runInAction(() => {
      this.message = message;
      this.check = check || this.check;
      this.color = color || this.color;
      this.timeout = timeout || this.timeout;
      this.preventOverride = preventOverride || this.preventOverride;
      this.positionNextToIcon = positionNextToIcon || this.positionNextToIcon;

      setTimeout(() => {
        this.resetToast();
      }, this.timeout);
    });
  };

  resetToast = () => {
    runInAction(() => {
      this.message = undefined;
      this.check = false;
      this.color = "blue";
      this.timeout = 2500;
      this.preventOverride = false;
      this.positionNextToIcon = true;
    });
  };
}

export default ToastStore;
