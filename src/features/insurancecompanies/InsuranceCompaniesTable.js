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

const InsuranceCompaniesTable = ({ insuranceCompanies, onEdit, onDelete }) => {
  return (
    <Table>
      <TableCaption>A list of your insurance companies.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead className="text-right w-[50px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {insuranceCompanies.map((company) => (
          <TableRow key={company.id}>
	          <TableCell>{company.name}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Ellipsis color={"var(--primary)"} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={"w-56 mx-2"}>
                  <DropdownMenuLabel>
                    Insurance Company Actions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => onEdit(company.id)}
                      className={"w-full"}
                    >
                      Edit Company
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() => onDelete(company.id)}
                      className={"w-full"}
                    >
                      Delete Company
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

export default React.memo(InsuranceCompaniesTable);
