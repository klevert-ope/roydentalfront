import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Ellipsis} from "lucide-react";
import React from "react";

const AppointmentsTable = ({ appointments, onEdit, onDelete }) => {
  return (
    <Table>
      <TableCaption>A list of your appointments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead className="w-[100px]">Doctor ID</TableHead>
          <TableHead className="w-[150px]">Date and Time</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Ellipsis/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mx-2">
                  <DropdownMenuLabel>Appointment Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => onEdit(appointment.id)}
                      className="w-full"
                    >
                      Edit Appointment
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => onDelete(appointment.id)}
                      className="w-full"
                    >
                      Delete Appointment
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell className="font-medium text-nowrap">
              {appointment.doctor_id}
            </TableCell>
            <TableCell className={"text-nowrap"}>
              {new Date(appointment.date_time).toLocaleString("en-KE", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TableCell>
            <TableCell>{appointment.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AppointmentsTable;
