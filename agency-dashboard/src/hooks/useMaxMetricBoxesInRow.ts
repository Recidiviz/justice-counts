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

import { useEffect, useMemo, useState } from "react";

import { METRIC_BOX_DESKTOP_WIDTH } from "../AgencyOverview";

export const useMaxMetricBoxesInRow = () => {
  const [maxMetricBoxesInRow, setMaxMetricBoxesInRow] = useState(
    // 48 is horizontal padding (24 + 24) + 1 extra pixel
    Math.floor((window.innerWidth - (48 - 1)) / METRIC_BOX_DESKTOP_WIDTH)
  );

  useEffect(() => {
    const handler = () =>
      setMaxMetricBoxesInRow(
        Math.floor((window.innerWidth - 48 - 1) / METRIC_BOX_DESKTOP_WIDTH)
      );
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return useMemo(() => maxMetricBoxesInRow, [maxMetricBoxesInRow]);
};
