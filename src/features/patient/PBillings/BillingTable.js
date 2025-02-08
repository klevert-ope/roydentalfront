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

const BillingsTable = ({ billings, onEdit, onDelete }) => {
  return (
    <Table>
      <TableCaption>A list of your billings.</TableCaption>
      <TableHeader>
	      <TableRow className="whitespace-nowrap">
          <TableHead className="w-[50px]"></TableHead>
          <TableHead className="w-[100px]">Doctor ID</TableHead>
          <TableHead className="w-[150px]">Procedure</TableHead>
          <TableHead className="w-[150px]">Billing Amount</TableHead>
          <TableHead className="w-[150px]">Paid Cash Amount</TableHead>
          <TableHead className="w-[150px]">Paid Insurance Amount</TableHead>
          <TableHead className="w-[150px]">Balance</TableHead>
          <TableHead className="w-[150px]">Total Received</TableHead>
          <TableHead className="w-[150px]">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {billings.map((billing) => (
	        <TableRow key={billing.billing_id} className="whitespace-nowrap">
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
	                      onEdit(billing.billing_id)}
                      className={"w-full"}
                    >
                      Edit Bill
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant="ghost"
                      onClick={() =>
	                      onDelete(billing.billing_id)}
                      className={"w-full"}
                    >
                      Delete Bill
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
		        <TableCell className="font-medium">
              {billing.doctor_id}
            </TableCell>
            <TableCell>{billing.procedure}</TableCell>
            <TableCell>{billing.billing_amount}</TableCell>
            <TableCell>{billing.paid_cash_amount}</TableCell>
            <TableCell>{billing.paid_insurance_amount}</TableCell>
            <TableCell>{billing.balance}</TableCell>
            <TableCell>{billing.total_received}</TableCell>
		        <TableCell>
              {new Date(billing.created_at).toLocaleString("en-KE", {
                timeZone: "Africa/Nairobi",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BillingsTable;
