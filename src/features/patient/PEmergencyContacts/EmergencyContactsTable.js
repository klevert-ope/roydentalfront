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

const EmergencyContactsTable = ({ emergencyContacts, onEdit, onDelete }) => {
  return (
    <Table>
      <TableCaption>A list of your emergency contacts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="w-[100px]">Phone</TableHead>
          <TableHead className="w-[100px]">Relationship</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emergencyContacts.map((emergencyContact, index) => (
          <TableRow key={emergencyContact.id || index}>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Ellipsis/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={"w-56 mx-2"}>
                  <DropdownMenuLabel>Bill Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        onEdit(emergencyContact.id)}
                      className={"w-full"}
                    >
                      Edit Contact
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => onDelete(emergencyContact.id)}
                      className={"w-full"}
                    >
                      Delete Contact
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell className="font-medium">
              {emergencyContact.name}
            </TableCell>
            <TableCell>{emergencyContact.phone}</TableCell>
            <TableCell>{emergencyContact.relationship}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EmergencyContactsTable;
