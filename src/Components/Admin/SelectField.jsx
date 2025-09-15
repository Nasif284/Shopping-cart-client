import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";
import get from "lodash/get";

const SelectField = ({
  name,
  control,
  errors,
  label,
  options = [],
  width,
  disabled,
}) => {
  const errorMessage = get(errors, name)?.message;

  return (
    <div className={`w-[${width}]`}>
      <Controller
        name={name}
        disabled={disabled}
        control={control}
        render={({ field }) => (
          <FormControl className="w-full" error={!!errorMessage}>
            <InputLabel>{label}</InputLabel>
            <Select {...field} label={label}>
              {options.map((opt, i) => (
                <MenuItem key={i} value={opt?.label ? opt.label : opt.name}>
                  {opt?.label ? opt.label : opt.name}
                </MenuItem>
              ))}
            </Select>
            {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
          </FormControl>
        )}
      />
    </div>
  );
};

export default SelectField;
