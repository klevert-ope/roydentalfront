import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {SquareArrowDown, SquareArrowUp} from "lucide-react";
import React, {useMemo, useState} from "react";

const BillingsTable = ({ data }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState("");
  const [sorting, setSorting] = useState([]);

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => [
    columnHelper.accessor("billing_id", {
      header: "Billing ID",
      cell: ({ getValue }) => getValue() || "-",
      size: 100,
    }),
    columnHelper.accessor("patient_id", {
      header: "Patient ID",
      cell: ({ getValue }) => getValue() || "-",
      size: 100,
    }),
    columnHelper.accessor("doctor_id", {
      header: "Doctor ID",
      cell: ({ getValue }) => getValue() || "-",
      size: 100,
    }),
    columnHelper.accessor("procedure", {
      header: "Procedure",
      cell: ({ getValue }) => getValue() || "-",
    }),
    columnHelper.accessor("billing_amount", {
      header: "Billing Amount",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `KES ${value.toLocaleString()}` : "-";
      },
      footer: () => {
        const total = data.reduce((sum, row) => sum + row.billing_amount, 0);
        return `KES ${total.toLocaleString()}`;
      },
    }),
    columnHelper.accessor("paid_cash_amount", {
      header: "Paid Cash Amount",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `KES ${value.toLocaleString()}` : "-";
      },
      footer: () => {
        const total = data.reduce((sum, row) => sum + row.paid_cash_amount, 0);
        return `KES ${total.toLocaleString()}`;
      },
    }),
    columnHelper.accessor("paid_insurance_amount", {
      header: "Paid Insurance Amount",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `KES ${value.toLocaleString()}` : "-";
      },
      footer: () => {
        const total = data.reduce(
          (sum, row) => sum + row.paid_insurance_amount,
          0,
        );
        return `KES ${total.toLocaleString()}`;
      },
    }),
    columnHelper.accessor("balance", {
      header: "Balance",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `KES ${value.toLocaleString()}` : "-";
      },
      footer: () => {
        const total = data.reduce((sum, row) => sum + row.balance, 0);
        return `KES ${total.toLocaleString()}`;
      },
    }),
    columnHelper.accessor("total_received", {
      header: "Total Received",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `KES ${value.toLocaleString()}` : "-";
      },
      footer: () => {
        const total = data.reduce((sum, row) => sum + row.total_received, 0);
        return `KES ${total.toLocaleString()}`;
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: ({ getValue }) => {
        const date = getValue();
        return date
          ? new Date(date).toLocaleString("en-KE", {
            timeZone: "Africa/Nairobi",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
          : "-";
      },
    }),
  ], [data, columnHelper]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnVisibility,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <div className={"my-16"}>
      <h1 className={"text-center mb-8"}>BILLINGS</h1>
      {/* Table Controls */}
      <div className={"flex flex-row justify-between"}>
        <div className={"max-w-52 mr-2"}>
          <Input
            type="text"
            placeholder="Search ..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <Select>
          <SelectTrigger className={"max-w-40 text-[var(--foreground)]"}>
            <SelectValue placeholder="Columns" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <Label>
                <input
                  {...{
                    type: "checkbox",
                    checked: table.getIsAllColumnsVisible(),
                    onChange: table.getToggleAllColumnsVisibilityHandler(),
                  }}
                />{" "}
                Toggle All
              </Label>
              {table.getAllLeafColumns().map((column) => (
                <div key={column.id} className={"px-1 mt-1"}>
                  <Label>
                    <input
                      {...{
                        type: "checkbox",
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{" "}
                    {flexRender(column.columnDef.header)}
                  </Label>
                </div>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {
        /* Table */
      }
      <div className={"my-4 w-full overflow-auto"}>
        <Table>
          <TableCaption>A list of billings.</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    scope="col"
                    className={"whitespace-nowrap"}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <span className="ml-2">
                        {{
                          asc: <SquareArrowUp />,
                          desc: <SquareArrowDown />,
                        }[header.column.getIsSorted()] ?? null}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    scope="row"
                    className={"whitespace-nowrap"}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-[var(--foreground)] text-black font-bold">
              {table.getFooterGroups()[0].headers.map((header) => (
                <TableCell key={header.id} className={"whitespace-nowrap"}>
                  {flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Pagination */}
      <div>
        <div
          className={"flex flex-row justify-between" +
            " items-center mt-4"}
        >
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <p className={"ml-4"}>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <Button
            className={"ml-4"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className={"mt-4 flex justify-end"}>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className={"max-w-32 text-[var(--foreground)]"}>
              <SelectValue placeholder="Pages" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    Show {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BillingsTable);
