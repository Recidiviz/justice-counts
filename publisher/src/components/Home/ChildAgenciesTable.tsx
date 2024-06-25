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

import { showToast } from "@justice-counts/common/components/Toast";
import { ChildAgency } from "@justice-counts/common/types";
import { TooltipTrigger } from "@recidiviz/design-system";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnFiltersState,
  createColumnHelper,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { snakeCase, startCase } from "lodash";
import React, { useRef, useState } from "react";

import { ReactComponent as CopyIcon } from "../assets/copy-icon.svg";
import { ReactComponent as EditIcon } from "../assets/edit-icon.svg";
import { ReactComponent as SortIcon } from "../assets/sort-icon.svg";
import * as Styled from "./ChildAgenciesTable.styled";
import EditModal from "./EditModal";
import SystemsCheckboxDropdown from "./SystemsCheckboxDropdown";
import TableSearchInput from "./TableSearchInput";

type ChildAgenciesTableProps = {
  data: ChildAgency[];
};

const fuzzyFilterFn: FilterFn<ChildAgency> = (
  row,
  columnId,
  value,
  addMeta
) => {
  const itemRank = rankItem(row.getValue(columnId), value, { threshold: 3 });

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

const columnHelper = createColumnHelper<ChildAgency>();

const columns = [
  columnHelper.accessor("name", {
    header: () => "Child Agency",
    cell: (info) => {
      const childAgencyName = info.getValue();
      const childAgencyId = info.row.original.id;

      return (
        <Styled.CustomLink to={`/agency/${childAgencyId}`}>
          {childAgencyName}
        </Styled.CustomLink>
      );
    },
  }),
  columnHelper.accessor("custom_child_agency_name", {
    header: () => "Upload ID",
    cell: function Cell(info) {
      const [showEditIcons, setShowEditIcons] = useState(false);
      const [showEditModal, setShowEditModal] = useState(false);
      const [uploadId, setUploadId] = useState(info.getValue());

      const childAgencyId = info.row.original.id;

      const copyIdToClipboard = async (id: string) => {
        try {
          await navigator.clipboard.writeText(id);
          showToast({
            message: "Upload ID copied!",
            check: true,
          });
        } catch {
          showToast({
            message: "Error copying Upload ID",
            color: "red",
          });
        }
      };

      return (
        <Styled.EditableCell
          onMouseEnter={() => setShowEditIcons(true)}
          onMouseLeave={() => setShowEditIcons(false)}
        >
          {uploadId || <Styled.Null>–</Styled.Null>}
          <Styled.EditIcons>
            {showEditIcons && (
              <>
                {uploadId && (
                  <Styled.IconButton
                    id={`${snakeCase(uploadId)}_copy-button`}
                    label={<CopyIcon />}
                    tooltipMsg="Copy"
                    onClick={() => copyIdToClipboard(uploadId)}
                  />
                )}
                <Styled.IconButton
                  id={`${snakeCase(uploadId)}_edit-button`}
                  label={<EditIcon />}
                  tooltipMsg="Edit"
                  onClick={() => setShowEditModal(true)}
                />
              </>
            )}
          </Styled.EditIcons>
          {showEditModal && (
            <EditModal
              title="Upload ID"
              defaultValue={uploadId}
              childAgencyId={childAgencyId}
              setUpdatedUploadId={(updatedUploadId) =>
                setUploadId(updatedUploadId)
              }
              closeModal={() => setShowEditModal(false)}
            />
          )}
        </Styled.EditableCell>
      );
    },
  }),
  columnHelper.accessor("systems", {
    header: () => "Sectors",
    enableSorting: false,
    filterFn: "arrIncludesSome",
    cell: (info) => {
      const systems = info.getValue();

      const hasOverflowSystems = systems.length > 3;
      const visibleSystemsCount = 2;
      const visibleSystems = hasOverflowSystems
        ? systems.slice(0, visibleSystemsCount)
        : systems;

      return (
        <>
          {visibleSystems.map((system) => (
            <Styled.CustomPill key={system}>
              {startCase(system.toLocaleLowerCase())}
            </Styled.CustomPill>
          ))}
          {hasOverflowSystems && (
            <TooltipTrigger
              contents={systems.slice(visibleSystemsCount).map((system) => (
                <div key={system}>{startCase(system.toLocaleLowerCase())}</div>
              ))}
            >
              <Styled.CustomPill>
                + {systems.length - visibleSystemsCount} more
              </Styled.CustomPill>
            </TooltipTrigger>
          )}
        </>
      );
    },
  }),
];

const ChildAgenciesTable = ({ data }: ChildAgenciesTableProps) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const table = useReactTable({
    data,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilterFn,
    initialState: {
      sorting: [{ id: "name", desc: false }],
    },
    state: {
      pagination,
      globalFilter,
      columnFilters,
    },
  });

  const totalRowCount = table.getRowCount();
  const hasPagination = totalRowCount > pagination.pageSize;
  const pageStart =
    table.getState().pagination.pageIndex * pagination.pageSize + 1;
  const pageEnd = Math.min(
    (table.getState().pagination.pageIndex + 1) * pagination.pageSize,
    totalRowCount
  );
  const pagePrompt =
    pageStart === pageEnd ? pageEnd : `${pageStart} – ${pageEnd}`;

  return (
    <Styled.Wrapper ref={tableRef}>
      <Styled.TableMenu>
        <TableSearchInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
        />
        <SystemsCheckboxDropdown
          onClickShowButton={(systems) => {
            setColumnFilters([{ id: "systems", value: systems }]);
            tableRef.current?.click();
          }}
        />
        {hasPagination && (
          <Styled.Pagination>
            <Styled.Pages>
              {pagePrompt} <span>of</span> {totalRowCount}
            </Styled.Pages>
            <Styled.PaginationButton
              label="Previous"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            />
            <Styled.PaginationButton
              label="Next"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            />
          </Styled.Pagination>
        )}
      </Styled.TableMenu>
      <Styled.Table>
        <Styled.TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <Styled.TR key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Styled.TH key={header.id} colSpan={header.colSpan}>
                  <Styled.SortableHeader
                    sortable={header.column.getCanSort()}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && <SortIcon />}
                  </Styled.SortableHeader>
                </Styled.TH>
              ))}
            </Styled.TR>
          ))}
        </Styled.TableHeader>
        <Styled.TableBody>
          {table.getRowModel().rows.map((row) => (
            <Styled.TR key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Styled.TD key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Styled.TD>
              ))}
            </Styled.TR>
          ))}
        </Styled.TableBody>
      </Styled.Table>
      {totalRowCount === 0 && (
        <Styled.EmptyWrapper>No Results Found</Styled.EmptyWrapper>
      )}
    </Styled.Wrapper>
  );
};

export default ChildAgenciesTable;
