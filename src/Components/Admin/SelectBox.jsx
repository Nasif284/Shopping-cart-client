import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectBox({ placeholder, category, onChange }) {
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedValue(value);
    if (onChange) onChange(value);
  };

  return (
    <div>
      <Select
        displayEmpty
        disabled={category == ""}
        value={selectedValue}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (!selected) {
            return <em>{placeholder}</em>;
          }
          return selected;
        }}
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
        className="w-[250px] !text-[15px] p-0 h-[40px] mb-5"
      >
        <MenuItem disabled value="">
          <em>{placeholder}</em>
        </MenuItem>
        {category.map((cat) => (
          <MenuItem key={cat.name} value={cat.name}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
