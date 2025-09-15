import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { SelectField, UploadBox } from "../../Components/Admin";
import { IoIosClose } from "react-icons/io";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productValidationSchema } from "../../Utils/YupSchemas";
import toast from "react-hot-toast";
import { useProductAddMutation } from "../../Store/Api/admin/product";
import { useGetCategoriesByLevelQuery } from "../../Store/Api/admin/category";
import { useGetSizesQuery } from "../../Store/Api/admin/size";

const AddProducts = () => {
  const [addProduct, { isLoading }] = useProductAddMutation();
  const { data: sizes, isLoading: sizesLoading } = useGetSizesQuery();
  let { data: subCats, isLoading: isSubCatLoading } =
    useGetCategoriesByLevelQuery({ level: "second" });
  let { data: rootCats, isLoading: isRootCatLoading } =
    useGetCategoriesByLevelQuery({ level: "first" });
  let { data: thirdCats, isLoading: isThirdCatLoading } =
    useGetCategoriesByLevelQuery({ level: "third" });

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    getValues,
    reset,
    watch,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(productValidationSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      subCategory: "",
      thirdCategory: "",
      brand: "",
      isFeatured: "No",
      variants: [
        {
          size: "",
          price: "",
          oldPrice: "",
          stock: "",
          color: "#0",
          images: [],
        },
      ],
    },
  });

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: "variants",
  });

  const category = watch("category");
  const subCategory = watch("subCategory");

  const handleImageUpload = (croppedFiles, index) => {
    const filesArray = Array.isArray(croppedFiles)
      ? croppedFiles
      : [croppedFiles];

    const fileArray = filesArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const currentVariant = getValues(`variants.${index}`);
    update(index, {
      ...currentVariant,
      images: [...(currentVariant?.images || []), ...fileArray],
    });
  };

  const removeImage = (index, imgIndex) => {
    const currentVariant = getValues(`variants.${index}`);
    const updatedImages = [...(currentVariant?.images || [])];

    URL.revokeObjectURL(updatedImages[imgIndex].preview);
    updatedImages.splice(imgIndex, 1);

    update(index, {
      ...currentVariant,
      images: updatedImages,
    });
  };

  const addVariants = async () => {
    const lastIndex = fields.length - 1;
    const isValid = await trigger(`variants.${lastIndex}`);
    if (!isValid) {
      toast.error("Fix errors in current variant before adding new one");
      return;
    }
    append({
      size: "",
      price: "",
      oldPrice: "",
      stock: "",
      color: "#0",
      images: [],
    });
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("thirdCategory", data.thirdCategory);
      formData.append("brand", data.brand);
      formData.append("isFeatured", data.isFeatured === "Yes");

      data.variants.forEach((variant, i) => {
        formData.append(`variants[${i}][size]`, variant.size);
        formData.append(`variants[${i}][price]`, variant.price);
        formData.append(`variants[${i}][oldPrice]`, variant.oldPrice || "");
        formData.append(`variants[${i}][stock]`, variant.stock);
        formData.append(`variants[${i}][color]`, variant.color);
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((imageObj) => {
            formData.append(`variants[${i}][images]`, imageObj.file);
          });
        }
      });

      const res = await addProduct(formData).unwrap();
      toast.success(res.message || "Product added successfully");

      data.variants.forEach((variant) => {
        variant.images?.forEach((img) => {
          if (img.preview) {
            URL.revokeObjectURL(img.preview);
          }
        });
      });

      reset();
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

  if (
    isSubCatLoading ||
    isRootCatLoading ||
    isThirdCatLoading ||
    sizesLoading
  ) {
    return <h1>Loading</h1>;
  }

  subCats = subCats.categories
    .filter((cat) => !cat.isBlocked)
    .filter((cat) => cat.parentCatName == category.toLowerCase());
  rootCats = rootCats.categories.filter((cat) => !cat.isBlocked);
  thirdCats = thirdCats.categories
    .filter((cat) => !cat.isBlocked)
    .filter((cat) => cat.parentCatName == subCategory.toLowerCase());

  return (
    <div className="my-4 w-full shadow-md sm:rounded-lg bg-white p-5">
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
              width="24%"
            />
            <SelectField
              name="subCategory"
              control={control}
              errors={errors}
              label="Sub Category"
              options={subCats}
              disabled={!category}
              width="24%"
            />
            <SelectField
              name="thirdCategory"
              control={control}
              errors={errors}
              label="Third Level Category"
              options={thirdCats}
              width="24%"
              disabled={!subCategory}
            />
            <TextField
              {...register("brand")}
              error={!!errors.brand?.message}
              helperText={errors.brand?.message}
              label="Brand"
              variant="outlined"
              className="w-[24%]"
            />
          </div>
          <div className="w-full flex gap-4">
            <SelectField
              name={`isFeatured`}
              control={control}
              label="Is Featured"
              options={[{ name: "Yes" }, { name: "No" }]}
              width="24%"
            />
          </div>

          {fields.map((field, i) => (
            <div key={field.id} className="variants-section pt-2 w-full">
              <h2 className="text-[18px] font-[600] py-3 flex justify-between items-center">
                Add Variant #{i + 1}
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(i)}
                    className="!bg-red-500 !text-white !font-[600] !capitalize !px-5 !py-2 !rounded-md"
                  >
                    Remove Variant
                  </Button>
                )}
              </h2>

              <div className="flex gap-3 flex-wrap w-full">
                <div className="w-full flex justify-between">
                  {category == "Fashion" ? (
                    <SelectField
                      name={`variants.${i}.size`}
                      control={control}
                      errors={errors}
                      label="Size"
                      options={sizes.sizes}
                      width="24%"
                    />
                  ) : category == "Beauty" ? (
                    <TextField
                      {...register(`variants.${i}.size`)}
                      error={!!errors?.variants?.[i]?.size}
                      helperText={errors?.variants?.[i]?.size?.message}
                      type="string"
                      label="Weight"
                      variant="outlined"
                      className="w-[24%]"
                    />
                  ) : (
                    <TextField
                      {...register(`variants.${i}.size`)}
                      error={!!errors?.variants?.[i]?.size}
                      helperText={errors?.variants?.[i]?.size?.message}
                      label="Size"
                      variant="outlined"
                      className="w-[24%]"
                    />
                  )}
                  <TextField
                    {...register(`variants.${i}.price`)}
                    error={!!errors?.variants?.[i]?.price}
                    helperText={errors?.variants?.[i]?.price?.message}
                    type="number"
                    label="Price"
                    variant="outlined"
                    className="w-[24%]"
                  />
                  <TextField
                    {...register(`variants.${i}.oldPrice`)}
                    label="Old Price"
                    type="number"
                    variant="outlined"
                    className="w-[24%]"
                  />
                  <TextField
                    {...register(`variants.${i}.stock`)}
                    error={!!errors?.variants?.[i]?.stock}
                    helperText={errors?.variants?.[i]?.stock?.message}
                    label="Stock"
                    type="number"
                    variant="outlined"
                    className="w-[24%]"
                  />
                </div>

                <div className="w-[24%] flex items-center justify-between border border-[rgba(0,0,0,0.1)] rounded-sm px-3">
                  <label className="text-sm text-gray-500">Color</label>
                  <TextField
                    {...register(`variants.${i}.color`)}
                    type="color"
                    error={!!errors?.variants?.[i]?.color}
                    helperText={errors?.variants?.[i]?.color?.message}
                    variant="outlined"
                    className="w-[60px] h-[50px] rounded-lg overflow-hidden"
                    InputProps={{
                      sx: {
                        padding: 0,
                        "& input": {
                          padding: 0,
                          height: "50px",
                          width: "60px",
                          cursor: "pointer",
                          border: "none",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {field.images && field.images.length > 0 && (
                <div className="flex gap-3 flex-wrap mt-4">
                  {field.images.map((file, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="flex flex-col gap-3 justify-center relative items-center bg-gray-100 hover:bg-gray-200 w-[15%] rounded-md border-dashed border-[rgba(0,0,0,0.2)] h-[120px]"
                    >
                      <span
                        onClick={() => removeImage(i, imgIndex)}
                        className="w-[20px] h-[20px] bg-red-500 absolute text-white rounded-full -top-[8px] -right-[8px] flex items-center justify-center cursor-pointer hover:bg-red-600 z-10"
                      >
                        <IoIosClose />
                      </span>
                      <img
                        src={file.preview}
                        className="w-full h-full object-cover rounded-md"
                        alt={`Preview ${imgIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <UploadBox
                error={errors?.variants?.[i]?.images}
                register={register(`variants.${i}.images`)}
                handleImageUpload={(files) => handleImageUpload(files, i)}
                multiple={true}
              />
            </div>
          ))}

          <Button
            type="button"
            onClick={addVariants}
            className="!flex !ml-auto w-[25%] !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
          >
            Add Variant
          </Button>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="!flex w-full !bg-primary !text-white !font-[600] !capitalize !px-5 !gap-3 !mt-4"
        >
          {isLoading ? (
            <CircularProgress size={30} color="inherit" />
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddProducts;
