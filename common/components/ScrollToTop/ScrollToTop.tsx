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
import { palette } from "@justice-counts/common/components/GlobalStyles";
import { Icon, IconSVG } from "@recidiviz/design-system";
import React from "react";
// eslint-disable-next-line no-restricted-imports
import styled from "styled-components";

type ScrollToTopProps = {
  label?: string;
};

const Wrapper = styled.div`
  position: fixed;
  right: 48px;
  bottom: 75px;
  z-index: 99999;
`;

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ label }) => {
  const handleScrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (offset < 1000) return null;

  return (
    <Wrapper>
      <Button
        style={{
          borderRadius: "50%",
          minWidth: "unset",
          height: 50,
          width: 50,
        }}
        label={
          label ?? (
            <Icon
              color={palette.solid.white}
              kind={IconSVG.Arrow}
              width={18}
              rotate={270}
            />
          )
        }
        buttonColor="blue"
        onClick={handleScrollToTop}
      />
    </Wrapper>
  );
};
