import { FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { Controller } from "react-hook-form";

const DateField = ({ errorMessage, control, label, name }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl className="w-full" error={!!errorMessage}>
          <DatePicker
            label={label}
            value={field.value}
            onChange={(date) => field.onChange(date)}
            slotProps={{
              textField: {
                helperText: errorMessage,
                error: !!errorMessage,
              },
            }}
          />
        </FormControl>
      )}
    />
  );
};

export default DateField;
