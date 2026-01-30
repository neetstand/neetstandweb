"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

interface Country {
    value: string;
    label: string;
    code: string;
    flag: string;
}

// Comprehensive list of countries with codes
const countries: Country[] = [
    { value: "in", label: "India", code: "+91", flag: "🇮🇳" },
    { value: "us", label: "United States", code: "+1", flag: "🇺🇸" },
    { value: "gb", label: "United Kingdom", code: "+44", flag: "🇬🇧" },
    { value: "ca", label: "Canada", code: "+1", flag: "🇨🇦" },
    { value: "ae", label: "UAE", code: "+971", flag: "🇦🇪" },
    { value: "om", label: "Oman", code: "+968", flag: "🇴🇲" },
    { value: "bh", label: "Bahrain", code: "+973", flag: "🇧🇭" },
    { value: "sa", label: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
    { value: "qa", label: "Qatar", code: "+974", flag: "🇶🇦" },
    { value: "sg", label: "Singapore", code: "+65", flag: "🇸🇬" },
];

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function CountrySelect({ value, onChange, disabled }: CountrySelectProps) {
    const [open, setOpen] = React.useState(false);

    // Find selected country or default to India
    const selectedCountry = countries.find((country) => country.code === value) || countries[0];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[110px] h-9 justify-between px-3 font-normal text-muted-foreground hover:text-foreground"
                    disabled={disabled}
                >
                    <span className="flex items-center gap-2 truncate">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="font-medium text-foreground">{selectedCountry.code}</span>
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start" side="bottom">
                <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList className="!max-h-[200px] !overflow-y-auto">
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {countries.map((country) => (
                                <CommandItem
                                    key={country.value}
                                    value={country.label}
                                    onSelect={() => {
                                        onChange(country.code);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === country.code ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span className="mr-2 text-lg">{country.flag}</span>
                                    <span className="flex-1">{country.label}</span>
                                    <span className="text-muted-foreground">{country.code}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
