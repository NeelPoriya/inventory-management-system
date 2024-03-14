"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Option = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;

  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
};

export default function MultiSelect(props: MultiSelectProps) {
  const { label } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {props.options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={props.value.includes(option.value)}
            onCheckedChange={(checked) => {
              if (checked) {
                props.onChange([...props.value, option.value]);
              } else {
                props.onChange(props.value.filter((v) => v !== option.value));
              }
            }}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
