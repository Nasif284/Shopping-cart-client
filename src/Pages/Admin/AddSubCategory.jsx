import { Button, CircularProgress, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { SelectField } from "../../Components/Admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { subCatSchema } from "../../Utils/YupSchemas";
import toast from "react-hot-toast";
import {
  useCategoryAddMutation,
  useGetCategoriesByLevelQuery,
} from "../../Store/Api/admin/category";

const AddSubCategory = () => {
  const [addSubCat, { isLoading }] = useCategoryAddMutation();
  const [addThirdCat, { isLoading: isThirdLoading }] = useCategoryAddMutation();
  let { data: subCats, isLoading: isSubCatLoading } =
    useGetCategoriesByLevelQuery({ level: "second" });
  let { data: rootCats, isLoading: isRootCatLoading } =
    useGetCategoriesByLevelQuery({ level: "first" });

  const subCat = useForm({
    mode: "onBlur",
    resolver: yupResolver(subCatSchema),
    defaultValues: {
      name: "",
      parent: "",
    },
  });
  const thirdCat = useForm({
    mode: "onBlur",
    resolver: yupResolver(subCatSchema),
    defaultValues: {
      name: "",
      parent: "",
    },
  });
  const onSubCatSubmit = async (data) => {
    try {
      const res = await addSubCat({ ...data, level: "second" }).unwrap();
      toast.success(res.message || "Category added successfully");
      subCat.reset();
    } catch (error) {
      toast.error(error.data || "Category adding filed");
    }
  };
  const onThirdCatSubmit = async (data) => {
    try {
      const res = await addThirdCat({ ...data, level: "third" }).unwrap();
      toast.success(res.message || "Category added successfully");
      thirdCat.reset();
    } catch (error) {
      toast.error(error.data || "Category adding filed");
    }
  };
  if (isSubCatLoading || isRootCatLoading) {
    return <h1>Loading</h1>;
  }
  subCats = subCats.categories.filter((cat) => !cat.isBlocked);
  rootCats = rootCats.categories.filter((cat) => !cat.isBlocked);
  return (
    <div className="my-4 w-full flex gap-10 shadow-md sm:rounded-lg bg-white p-5">
      <div className="w-[50%]">
        <h2 className="text-[18px] font-[600]">Add Sub Category</h2>
        <form
          onSubmit={subCat.handleSubmit(onSubCatSubmit)}
          className="mt-5"
          action=""
        >
          <div className="flex flex-col gap-3">
            <TextField
              error={!!subCat.formState?.errors?.name}
              helperText={subCat.formState.errors?.name?.message}
              {...subCat.register("name")}
              id="outlined-basic"
              label="Category Name"
              variant="outlined"
              className="w-full"
            />

            <SelectField
              name="parent"
              control={subCat.control}
              errors={subCat.formState.errors}
              label="Parent Category"
              options={rootCats || []}
            />
          </div>

          <Button
            type="submit"
            className="!flex w-full  !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
          >
            {isLoading ? (
              <CircularProgress size={30} color="inherit" />
            ) : (
              <>Add Sub Category </>
            )}
          </Button>
        </form>
      </div>
      <div className="w-[50%]">
        <h2 className="text-[18px] font-[600]">Add Third Level Category</h2>
        <form
          onSubmit={thirdCat.handleSubmit(onThirdCatSubmit)}
          className="mt-5 w-full"
          action=""
        >
          <div className="flex flex-col gap-3 w-full">
            <TextField
              error={!!thirdCat.formState?.errors?.name}
              helperText={thirdCat.formState.errors?.name?.message}
              {...thirdCat.register("name")}
              id="outlined-basic"
              label="Category Name"
              variant="outlined"
              className="w-full"
            />
            <SelectField
              name="parent"
              control={thirdCat.control}
              errors={thirdCat.formState.errors}
              label="Parent Category"
              options={subCats || []}
              width={"100%"}
            />
          </div>
          <Button
            type="submit"
            className="!flex w-full !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
          >
            {isThirdLoading ? (
              <CircularProgress size={30} color="inherit" />
            ) : (
              <>Add Third Level Category </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategory;
