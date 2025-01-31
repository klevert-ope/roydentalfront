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

const DoctorsTable = ({ doctors, onEdit, onDelete }) => {
  return (
    <Table>
      <TableCaption>A list of your doctors.</TableCaption>
      <TableHeader>
        <TableRow>
	        <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="text-right w-[50px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id}>
	          <TableCell>Dr. {doctor.first_name} {doctor.last_name}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
	                  <Ellipsis/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={"w-56 mx-2"}>
                  <DropdownMenuLabel>Doctor Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => onEdit(doctor.id)}
                      className={"w-full"}
                    >
                      Edit Doctor
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => onDelete(doctor.id)}
                      className={"w-full"}
                    >
                      Delete Doctor
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default React.memo(DoctorsTable);
