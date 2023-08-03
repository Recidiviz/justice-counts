import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { palette } from "../GlobalStyles";

export const CategoryOverviewBreakdown: FunctionComponent<{ names: any[] }> = ({
  names,
}) => {
  return (
    <Container>
      {names.map(({ fill, value }) => (
        <LegendItem color={fill}>
          <LegendName color={palette.solid.black}>{value}</LegendName>
        </LegendItem>
      ))}
    </Container>
  );
};

const Container = styled.ul`
  width: 100%;
  display: flex;
`;

const LegendItem = styled.li<{ color: string }>`
  font-size: 24;
  color: ${({ color }) => color};
  list-style-type: square;
`;

const LegendName = styled.span<{ color: string }>`
  font-size: 18;
  color: ${({ color }) => color};
`;
