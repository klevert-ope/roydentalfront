import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DoctorComboBox = React.memo(
  ({ items, selectedValue, onSelect, placeholder, disabled }) => {
    const [open, setOpen] = React.useState(false);

    const selectedDisplayName = items.find((item) => item.id === selectedValue)
      ? `Dr ${items.find((item) => item.id === selectedValue)?.first_name} ${
        items.find((item) => item.id === selectedValue)?.last_name
      }`
      : null;

    return (
      <Popover open={open} onOpenChange={setOpen} className="w-full">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedDisplayName || placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Search..."
              className="h-9"
              disabled={disabled}
            />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-32">
                  {items.map((item) => {
                    const displayName =
                      `Dr ${item.first_name} ${item.last_name}`;
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.id.toString()}
                        onSelect={() => {
                          onSelect(item.id);
                          setOpen(false);
                        }}
                        disabled={disabled}
                      >
                        {displayName} {/* Display Name */}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedValue === item.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
