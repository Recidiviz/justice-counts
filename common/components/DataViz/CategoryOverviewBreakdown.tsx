import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { palette } from "../GlobalStyles";

export const CategoryOverviewBreakdown: FunctionComponent<{ names: any[] }> = ({
  names,
}) => {
  return (
    <Container>
      <ul>
        {names.map(({ fill, value }) => (
          <li style={{ fontSize: 24, color: fill, listStyleType: "square" }}>
            <span style={{ fontSize: 18, color: palette.solid.black }}>
              {value}
            </span>
          </li>
        ))}
      </ul>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
`;
