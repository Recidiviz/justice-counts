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

import { useSearchParams } from "react-router-dom";

import { SettingsSearchParams } from "./types";
import { getSettingsSearchParams } from "./utils";

export const useSettingsSearchParams = (): [
  SettingsSearchParams,
  (params: SettingsSearchParams, replaceHistory?: boolean) => void
] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const settingsSearchParams = getSettingsSearchParams(searchParams);
  const { system, metric } = settingsSearchParams;
  const shouldReplace = !system && !metric;
  const setSettingsSearchParams = (
    params: SettingsSearchParams,
    replaceHistory?: boolean
  ) => {
    setSearchParams(JSON.parse(JSON.stringify(params).toLowerCase()), {
      replace: replaceHistory || shouldReplace,
    });
  };

  return [settingsSearchParams, setSettingsSearchParams];
};
