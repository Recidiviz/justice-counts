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

import { useEffect, useState } from "react";

export function useIsFooterVisible() {
  const [isFooterVisible, setIsFooterVisible] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const footer = document.getElementById("footer");

    function setFooterVisibility() {
      setIsFooterVisible(checkIsFooterVisible(footer));
    }

    setIsFooterVisible(checkIsFooterVisible(footer));

    window.addEventListener("scroll", setFooterVisibility);
    return () => window.removeEventListener("scroll", setFooterVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isFooterVisible;
}

function checkIsFooterVisible(element: HTMLElement | null) {
  if (element) {
    const footerRectangle = element.getBoundingClientRect();
    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    );
    return !(
      footerRectangle.bottom < 0 || footerRectangle.top - viewHeight >= 0
    );
  }
}
