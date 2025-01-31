import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Ellipsis} from "lucide-react";
import React from "react";

export const ExaminationsAccord = ({ examinations, onEdit, onDelete }) => (
  <div className="mt-6">
    <Accordion type="single" collapsible className="w-full">
      {examinations?.map((examination) => (
        <AccordionItem key={examination.id} value={`item-${examination.id}`}>
          <AccordionTrigger>
            Examination Created on:{" "}
            {new Date(examination.created_at).toLocaleString("en-KE", {
              timeZone: "Africa/Nairobi",
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </AccordionTrigger>
          <AccordionContent className={"flex flex-row justify-between"}>
            <div
              className={"text-wrap"}
              dangerouslySetInnerHTML={{ __html: examination.report }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Ellipsis/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mx-2">
                <DropdownMenuLabel>Examination Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      onEdit(examination.id)}
                    className="w-full"
                  >
                    Edit Examination
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      onDelete(examination.id)}
                    className="w-full"
                  >
                    Delete Examination
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);
