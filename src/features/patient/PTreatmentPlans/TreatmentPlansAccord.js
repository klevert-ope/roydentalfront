import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const TreatmentPlansAccord = ({ plans, onEdit, onDelete }) => (
  <div className="mt-6">
    <Accordion type="single" collapsible className="w-full">
      {plans?.map((plan) => (
        <AccordionItem key={plan.id} value={`item-${plan.id}`}>
          <AccordionTrigger>
            Plan Created on:{" "}
            {new Date(plan.created_at).toLocaleString("en-KE", {
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
              dangerouslySetInnerHTML={{ __html: plan.plan }}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Ellipsis color={"var(--primary"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mx-2">
                <DropdownMenuLabel>
                  Treatment Plan Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      onEdit(plan.id)}
                    className="w-full"
                  >
                    Edit Appointment
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    onClick={() => onDelete(plan.id)}
                    className="w-full"
                  >
                    Delete Appointment
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
