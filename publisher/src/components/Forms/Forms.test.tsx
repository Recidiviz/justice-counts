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

import { Input } from "@justice-counts/common/components/Input";
import { render, screen } from "@testing-library/react";
import React from "react";

test("Optional input label without value expected to be default position, font-size and color", () => {
  render(
    <Input
      type="text"
      label="Total Staff"
      valueLabel="People"
      value=""
      readOnly
    />
  );

  const label = screen.getByText(/Total Staff/i);

  expect(window.getComputedStyle(label).top).toBe("26px");
  expect(window.getComputedStyle(label).fontSize).toBe("1.5rem");
  expect(window.getComputedStyle(label).color).toBe("rgba(0, 17, 51, 0.5)");

  expect.hasAssertions();
});

test("Required input label with value expected to shrink position, font-size and change color", () => {
  render(
    <Input
      type="text"
      label="Total Staff"
      valueLabel="People"
      value="100"
      readOnly
      required
    />
  );

  const label = screen.getByText(/Total Staff/i);

  expect(window.getComputedStyle(label).top).toBe("12px");
  expect(window.getComputedStyle(label).fontSize).toBe("0.75rem");
  expect(window.getComputedStyle(label).color).toBe("rgb(0, 115, 229)");

  expect.hasAssertions();
});

test("Error description appears in document", () => {
  render(
    <Input
      error={{ message: "Please enter valid number." }}
      type="text"
      label="Total Staff"
      valueLabel="People"
      value="-100"
      readOnly
      required
    />
  );

  const errorDescription = screen.getByText(/Please enter valid number./i);

  expect(errorDescription).toBeInTheDocument();

  expect.hasAssertions();
});

test("Error state changes text input colors to red", () => {
  render(
    <Input
      error={{ message: "Please enter valid number." }}
      type="text"
      name="Total Staff"
      id="Total Staff"
      label="Total Staff"
      valueLabel="People"
      value=""
      readOnly
      required
    />
  );

  const input = screen.getByLabelText("Total Staff");

  expect(window.getComputedStyle(input).background).toBe(
    "rgba(221, 18, 18, 0.05)"
  );

  expect.hasAssertions();
});
