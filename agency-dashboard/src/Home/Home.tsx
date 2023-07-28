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

import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { HeaderBar } from "../Header";
import { Loader } from "../Loading";
import { useStore } from "../stores";
import { slugify } from "../utils/formatting";
import * as Styled from "./Home.styles";
import { AgencyMetadata } from "./types";

export const Home = observer(() => {
  const navigate = useNavigate();
  const { agencyDataStore } = useStore();
  const [agenciesMetadata, setAgenciesMetadata] = useState<AgencyMetadata[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await agencyDataStore.fetchAllAgencies();
      setAgenciesMetadata(result.agencies);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agencyDataStore]);

  return (
    <>
      <Styled.HomeContainer>
        <HeaderBar />
        <Styled.Title>Welcome to Agency Dashboards</Styled.Title>

        {agencyDataStore.loading ? (
          <Loader />
        ) : (
          <Styled.AgencyDetailsContainer>
            {agenciesMetadata
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((agency) => (
                <Styled.AgencyDetailsWrapper
                  key={agency.id}
                  onClick={() =>
                    navigate(
                      `/agency/${encodeURIComponent(slugify(agency.name))}`
                    )
                  }
                >
                  <Styled.AgencyName>{agency.name}</Styled.AgencyName>
                  <Styled.NumberOfPublishedMetrics>
                    <span>{agency.number_of_published_metrics}</span> published
                    metrics
                  </Styled.NumberOfPublishedMetrics>
                </Styled.AgencyDetailsWrapper>
              ))}
          </Styled.AgencyDetailsContainer>
        )}
      </Styled.HomeContainer>
    </>
  );
});
