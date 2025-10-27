import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { SelectField } from "../Admin";
import { useAddAddressMutation } from "../../Store/Api/user/address";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressSchema } from "../../Utils/YupSchemas";
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const AddNewAddressModal = ({ open, handleClose }) => {
  const [add, { isLoading }] = useAddAddressMutation();

  const types = ["Home", "Office"];
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(addressSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await add(data).unwrap();
      toast.success(res.message || "Address Added Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "Error occurred");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div>
          <h2 className="text-[18px] font-[600]">Add New Address</h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-3"
          >
            <div className="flex gap-3 flex-wrap">
              <div className="w-full gap-4 flex justify-between">
                <TextField
                  {...register("name")}
                  error={!!errors.name?.message}
                  helperText={errors.name?.message}
                  label="Name"
                  variant="outlined"
                  className="w-[50%]"
                />
                <TextField
                  {...register("mobile")}
                  label="Mobile"
                  id="outlined-start-adornment"
                  sx={{ width: "25ch" }}
                  error={!!errors.mobile}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <span className="!text-[15px]">+91</span>
                        </InputAdornment>
                      ),
                    },
                  }}
                  helperText={errors?.mobile?.message}
                />
              </div>
            </div>
            <div className="w-full gap-4 flex justify-between">
              <TextField
                {...register("pin_code")}
                error={!!errors.pin_code?.message}
                helperText={errors.pin_code?.message}
                label="Pin-code"
                variant="outlined"
                className="w-[50%]"
              />
              <TextField
                {...register("locality")}
                error={!!errors.locality?.message}
                helperText={errors.locality?.message}
                label="Locality"
                variant="outlined"
                className="w-[50%]"
              />
            </div>
            <TextField
              {...register("address_line")}
              error={!!errors.address_line?.message}
              helperText={errors.address_line?.message}
              label="Address"
              multiline
              rows={2}
              className="w-full"
            />
            <div className="w-full gap-4 flex justify-between">
              <TextField
                {...register("city")}
                error={!!errors.city?.message}
                helperText={errors.city?.message}
                label="City"
                variant="outlined"
                className="w-[50%]"
              />
              <SelectField
                name="state"
                control={control}
                errors={errors}
                label="State"
                options={indianStates}
                width="50%"
              />
            </div>
            <div className="w-full gap-4 flex justify-between">
              <TextField
                {...register("landmark")}
                label="Landmark (optional)"
                error={!!errors.landmark?.message}
                helperText={errors.landmark?.message}
                variant="outlined"
                className="w-[50%]"
              />
              <TextField
                {...register("alternative_mobile")}
                error={!!errors.alternative_mobile?.message}
                helperText={errors.alternative_mobile?.message}
                label="Alt Phone Number (Opt)"
                variant="outlined"
                className="w-[50%]"
              />
            </div>
            <SelectField
              name="type"
              control={control}
              errors={errors}
              label="Type"
              options={types}
              width="50%"
            />

            <div className="w-full flex gap-3">
              <Button
                type="submit"
                className="!flex w-[50%]  !bg-green-500 !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
              >
                {isLoading ? (
                  <CircularProgress size={30} color="inherit" />
                ) : (
                  <>Save </>
                )}
              </Button>
              <Button
                onClick={handleClose}
                className="!flex w-[50%]  !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
              >
                Close
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAddressModal;
