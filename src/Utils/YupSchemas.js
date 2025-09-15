import * as yup from "yup";

export const productValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .min(6, "please enter minimum 6 characters")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
  description: yup.string().required("Description is required"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string().required("Sub Category is required"),
  thirdCategory: yup.string().required("Third Level Category is required"),
  brand: yup.string().required("Brand is required"),
  isFeatured: yup.string(),
  variants: yup.array().of(
    yup.object().shape({
      size: yup.string(),
      price: yup
        .number()
        .transform((value, originalValue) =>
          String(originalValue).trim() === "" ? null : value
        )
        .typeError("Price must be a number")
        .required("Price is required")
        .positive("Price must be positive"),
      oldPrice: yup
        .number()
        .nullable()
        .transform((value, originalValue) =>
          String(originalValue).trim() === "" ? null : value
        ),
      stock: yup
        .number()
        .transform((value, originalValue) =>
          String(originalValue).trim() === "" ? null : value
        )
        .typeError("Stock must be a number")
        .required("Stock is required")
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative"),
      images: yup
        .mixed()
        .test("required", "At least 1 image is required", (value) => {
          return value && value.length > 0;
        }),
    })
  ),
});

export const singUpValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("name is required")
    .min(3, "please enter minimum 3 characters")
    .matches(/^[A-Za-z ]+$/, "Name can only contain letters and spaces")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
  email: yup
    .string()
    .required("email is required")
    .email("invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .test("not-only-spaces", "Password cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password must match")
    .required("must enter confirm password"),
});

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("email is required")
    .email("invalid email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .test("not-only-spaces", "Password cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
});

export const forgotPassEmailSchema = yup.object().shape({
  email: yup
    .string()
    .required("email is required")
    .email("invalid email format"),
});

export const forgotPassResetSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .test("not-only-spaces", "Password cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Password must match")
    .required("must enter confirm password"),
});

export const subCatSchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
  parent: yup.string().required("This Field is required"),
});

export const catSchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileRequired", "Please upload an image", (value) => {
      return value && value.length > 0;
    })
    .test("fileFormat", "Unsupported file format", (value) => {
      return (
        value[0] &&
        ["image/jpg", "image/jpeg", "image/png"].includes(value[0].type)
      );
    }),
});

export const editCatSchema = yup.object().shape({
  name: yup
    .string()
    .required("Category name is required")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
});

export const addVariantSchema = yup.object().shape({
  size: yup.string(),
  price: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),
  oldPrice: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    ),
  stock: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Stock must be a number")
    .required("Stock is required")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
});


export const editVariantSchema = yup.object().shape({
  size: yup.string(),
  price: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),
  oldPrice: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    ),
  stock: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Stock must be a number")
    .required("Stock is required")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
});
