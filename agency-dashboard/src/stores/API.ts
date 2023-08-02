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
import { makeAutoObservable, runInAction } from "mobx";

import { request } from "../utils/networking";

export enum environment {
  PRODUCTION = "production",
  STAGING = "staging",
  DEVELOPMENT = "development",
}
export interface RequestProps {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: FormData | Record<string, unknown>;
  retrying?: boolean;
}

export default class API {
  environment: string;

  constructor() {
    makeAutoObservable(this);

    this.environment = "";

    this.getEnv();
  }

  async getEnv(): Promise<void | string> {
    try {
      const response = (await request({
        path: "/api/env",
        method: "GET",
      })) as Response;
      const { env } = await response.json();

      runInAction(() => {
        this.environment = env;
      });
    } catch (error) {
      if (error instanceof Error) return error.message;
      return String(error);
    }
  }
}
