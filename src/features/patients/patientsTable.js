"use client";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PatientForm from "@/features/patients/PatientForm";
import {ActionsCell} from "@/features/patients/viewPatient";
import {useCreatePatient, useFetchPatients} from "@/hooks/usePatients";
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
import React, {useCallback, useMemo, useState} from "react";
import toast from "react-hot-toast";

const PatientsTable = () => {
  const {data = []} = useFetchPatients();
  const createPatientMutation = useCreatePatient();
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = useCallback((data) => {
    createPatientMutation.mutate({ patientData: data }, {
      onSuccess: () => {
        toast.success("Patient created successfully!");
      },
      onError: () => {
        toast.error("Failed to create patient");
      },
    });
    setIsCreateDialogOpen(false);
  }, [createPatientMutation]);

  const customFirstNameSort = useMemo(
    () => (rowA, rowB) => {
      const firstNameA = rowA.original.first_name.toLowerCase();
      const firstNameB = rowB.original.first_name.toLowerCase();
      if (firstNameA < firstNameB) {
        return -1;
      }
      if (firstNameA > firstNameB) {
        return 1;
      }
      return 0;
    },
    [],
  );

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => [
    columnHelper.accessor("actions", {
      header: "",
      cell: ActionsCell,
      size: 80,
    }),
    columnHelper.accessor("id", {
      header: "ID",
      cell: ({ getValue }) => getValue() || "-",
      size: 100,
    }),
    columnHelper.accessor("fullName", {
      header: "Name",
      cell: ({ row }) =>
        `${row.original.first_name} ${
          row.original.middle_name || ""
        } ${row.original.last_name}`,
      sortingFn: customFirstNameSort,
    }),
    columnHelper.accessor("sex", {
      header: "Sex",
      cell: ({ getValue }) => getValue() || "-",
    }),
    columnHelper.accessor("date_of_birth", {
      header: "Date of Birth",
      cell: ({ getValue }) => {
        const date = getValue();
        return date
          ? new Date(date).toLocaleDateString(
            "en-KE",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            },
          )
          : "-";
      },
    }),
    columnHelper.accessor("insured", {
      header: "Insured",
      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    }),
    columnHelper.accessor("cash", {
      header: "Cash",
      cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
    }),
    columnHelper.accessor("insurance_company", {
      header: "Insurance Company",
      cell: ({ getValue }) => getValue() || "-",
    }),
    columnHelper.accessor("scheme", {
      header: "Scheme",
      cell: ({ getValue }) => getValue() || "-",
    }),
    columnHelper.accessor("cover_limit", {
      header: "Cover Limit",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `KES ${value.toLocaleString()}` : "-";
      },
    }),
    columnHelper.accessor("occupation", {
      header: "Occupation",
      cell: ({ getValue }) => getValue() || "-",
    }),
    columnHelper.accessor("place_of_work", {
      header: "Place of Work",
      cell: ({ getValue }) => getValue() || "-",
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: ({ getValue }) => getValue() || "-",
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: ({ getValue }) => getValue() || "-",
    }),
    columnHelper.accessor("address", {
      header: "Address",
      cell: ({ getValue }) => getValue() || "-",
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
  ], [columnHelper, customFirstNameSort]);

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
      <h1 className={"text-center mb-8"}>PATIENTS</h1>
      {/* Create Patient */}
      <Button
        className={"my-5"}
        onClick={() => setIsCreateDialogOpen(true)}
      >
        Create Patient
      </Button>

      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <DialogContent className="w-11/12 sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Create Patient</DialogTitle>
            <DialogDescription>
              Enter the details for the new patient.
            </DialogDescription>
          </DialogHeader>
          <PatientForm
            onSubmit={handleCreate}
            onClose={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

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
              {table.getAllLeafColumns()
                .filter((column) => column.id !== "actions")
                .map((column) => (
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
      <div className={"my-4"}>
        <Table>
          <TableCaption>A list of patients.</TableCaption>
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

export default React.memo(PatientsTable);
