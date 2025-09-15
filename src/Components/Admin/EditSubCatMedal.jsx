import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  useEditCategoryMutation,
  useGetCategoriesByLevelQuery,
} from "../../Store/Api/admin/category";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { subCatSchema } from "../../Utils/YupSchemas";
import SelectField from "./SelectField";

const EditSubCatModal = ({ open, handleClose, category, level }) => {
  const [edit, { isLoading }] = useEditCategoryMutation();
  let { data: subCats, isLoading: isSubCatLoading } =
    useGetCategoriesByLevelQuery({ level: "second" });
  let { data: rootCats, isLoading: isRootCatLoading } =
    useGetCategoriesByLevelQuery({ level: "first" });
  const toUpperCase = (value) => {
    return value[0].toUpperCase() + value.slice(1);
  };
  const {
    handleSubmit,
    formState: { errors },
    control,
    register,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(subCatSchema),
    defaultValues: {
      name: category.name,
      parent: toUpperCase(category.parentCatName),
    },
  });
  const onSubmit = async (data) => {
    try {
      const res = await edit({ id: category._id, data }).unwrap();
      toast.success(res.message || "category updated Successfully");
      handleClose();
    } catch (error) {
      toast.error(error.data || "category updating failed");
    }
  };
  if (isSubCatLoading || isRootCatLoading) {
    return <h1>Loading</h1>;
  }
  subCats = subCats.categories.filter((cat) => !cat.isBlocked);
  rootCats = rootCats.categories.filter((cat) => !cat.isBlocked);
  console.log(subCats);
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div className="w-full">
          <h2 className="text-[18px] font-[600]">Edit Sub Category</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5" action="">
            <div className="flex flex-col gap-3">
              <TextField
                error={!!errors?.name}
                helperText={errors?.name?.message}
                {...register("name")}
                id="outlined-basic"
                label="Category Name"
                variant="outlined"
                className="w-full"
              />
              <SelectField
                name="parent"
                control={control}
                errors={errors}
                label="Parent Category"
                options={level == "second" ? rootCats : subCats || []}
              />
            </div>
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

export default EditSubCatModal;
