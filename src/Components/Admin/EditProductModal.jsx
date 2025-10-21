import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useGetCategoriesByLevelQuery } from "../../Store/Api/admin/category";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProductSchema } from "../../Utils/YupSchemas";
import SelectField from "./SelectField";
import { useUpdateProductMutation } from "../../Store/Api/admin/product";

const EditProductModal = ({ open, handleClose, product }) => {
  const [update, { isLoading }] = useUpdateProductMutation();
  let { data: subCats, isLoading: isSubCatLoading } =
    useGetCategoriesByLevelQuery({ level: "second" });
  let { data: rootCats, isLoading: isRootCatLoading } =
    useGetCategoriesByLevelQuery({ level: "first" });
  let { data: thirdCats, isLoading: isThirdCatLoading } =
    useGetCategoriesByLevelQuery({level:"third"});
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      category: product.category.name,
      subCategory: product.subCategory.name,
      thirdCategory: product.thirdCategory.name,
      brand: product.brand,
      isFeatured: product.isFeatured ? "Yes" : "No",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await update({ data, id: product._id }).unwrap();
      toast.success(res.message || "Product updated Successfully");
      handleClose();
    } catch (error) {
      if (error?.errors) {
            Object.values(error.errors).forEach((err) => {
              toast.error(err.msg);
            });
          } else {
            toast.error(error.data || "Error occurred");
          }
    }
  };
  if (isSubCatLoading || isRootCatLoading || isThirdCatLoading) {
    return <h1>Loading</h1>;
  }
  subCats = subCats.categories.filter((cat) => !cat.isBlocked);
  rootCats = rootCats.categories.filter((cat) => !cat.isBlocked);
  thirdCats = thirdCats.categories.filter((cat) => !cat.isBlocked);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <div>
          <h2 className="text-[18px] font-[600]">Add Products </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="flex gap-3 flex-wrap">
              <TextField
                {...register("name")}
                error={!!errors.name?.message}
                helperText={errors.name?.message}
                label="Product Name"
                variant="outlined"
                className="w-full"
              />
              <TextField
                {...register("description")}
                error={!!errors.description?.message}
                helperText={errors.description?.message}
                label="Description"
                multiline
                rows={4}
                className="w-full"
              />
              <div className="w-full flex justify-between">
                <SelectField
                  name="category"
                  control={control}
                  errors={errors}
                  label="Category"
                  options={rootCats}
                  width="30%"
                />
                <SelectField
                  name="subCategory"
                  control={control}
                  errors={errors}
                  label="Sub Category"
                  options={subCats}
                  width="30%"
                />
                <SelectField
                  name="thirdCategory"
                  control={control}
                  errors={errors}
                  label="Third Level Category"
                  options={thirdCats}
                  width="30%"
                />
              </div>
              <div className="w-full flex  gap-7">
                <TextField
                  {...register("brand")}
                  error={!!errors.brand?.message}
                  helperText={errors.brand?.message}
                  label="Brand"
                  variant="outlined"
                  className="w-[30%]"
                />
                <SelectField
                  name={`isFeatured`}
                  control={control}
                  label="Is Featured"
                  options={[{ name: "Yes" }, { name: "No" }]}
                  width="30%"
                />
              </div>
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

export default EditProductModal;
