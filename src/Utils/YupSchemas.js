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
        )
        .required("Price is required")
        .test(
          "oldPrice-greater",
          "Old price must be greater than price",
          function (value) {
            const { price } = this.parent;
            if (value == null || price == null) return true;
            return value > price;
          }
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
        .test("required", "At least 1 image is required", function (value) {
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
  referralCode: yup
    .string()
    .trim()
    .optional()
    .matches(
      /^[A-Za-z0-9]*$/,
      "Referral code can only contain letters and numbers"
    ),
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
    .min(6, "Password must be at least 6 characters")
    .required("must enter confirm password"),
});

export const PasswordResetSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Current Password is required")
    .min(6, "Password must be at least 6 characters")
    .test("not-only-spaces", "Password cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
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
    .min(6, "Password must be at least 6 characters")
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
  image: yup.mixed().required("Image is required"),
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
    )
    .test(
      "oldPrice-greater",
      "Old price must be greater than price",
      function (value) {
        const { price } = this.parent;
        if (value == null || price == null) return true;
        return value > price;
      }
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
    )
    .test(
      "oldPrice-greater",
      "Old price must be greater than price",
      function (value) {
        const { price } = this.parent;
        if (value == null || price == null) return true;
        return value > price;
      }
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

export const userProfileSchema = yup.object().shape({
  name: yup
    .string()
    .required("Full Name is required")
    .min(6, "please enter minimum 6 characters")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
    .required("Phone number is required"),
});

export const editProductSchema = yup.object().shape({
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
});

export const addressSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),

  mobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile must be exactly 10 digits")
    .required("Mobile number is required"),

  pin_code: yup
    .string()
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit Pincode")
    .required("Pincode is required"),

  locality: yup.string().trim().required("Locality is required"),

  address_line: yup
    .string()
    .trim()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),

  city: yup.string().trim().required("City is required"),

  state: yup
    .string()
    .oneOf(
      [
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
      ],
      "Select a valid state"
    )
    .required("State is required"),

  landmark: yup.string().trim().nullable(),

  alternative_mobile: yup
    .string()
    .nullable()
    .matches(/^$|^[0-9]{10}$/, "Alternate mobile must be 10 digits"),

  type: yup
    .string()
    .oneOf(["Home", "Office"], "Invalid type")
    .required("Address type is required"),
});

export const reasonSchema = yup.object().shape({
  reason: yup
    .string()
    .required("Reason is required")
    .min(20, "please enter minimum 20 characters")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
});

export const reviewSchema = yup.object().shape({
  review: yup
    .string()
    .required("Review is required")
    .min(5, "please enter minimum 5 characters")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
});

export const offerSchema = yup.object().shape({
  discountValue: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Offer value must be a number")
    .required("Offer value is required")
    .max(100, "Offer value cannot exceed 100%"),
});

export const globalOfferSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(7, "please enter minimum 7 characters")
    .test("not-only-spaces", "Name cannot be empty spaces", (value) => {
      return value && value.trim().length > 0;
    }),
  discountValue: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .typeError("Offer value must be a number")
    .required("Offer value is required")
    .min(1, "Offer value must be at least 1%")
    .max(100, "Offer value cannot exceed 100%"),
  startDate: yup
    .date()
    .typeError("Start date is required")
    .required("Start date is required"),

  expiryDate: yup
    .date()
    .typeError("Expiry date is required")
    .required("Expiry date is required")
    .min(yup.ref("startDate"), "Expiry date must be after start date"),
});

export const couponSchema = yup.object().shape({
  code: yup
    .string()
    .trim()
    .required("Coupon code is required")
    .matches(
      /^[A-Za-z0-9_-]+$/,
      "Code can only contain letters, numbers, - and _"
    )
    .max(8, "Code must be 8 characters or less"),

  discountType: yup
    .string()
    .required("Discount type is required")
    .oneOf(["Percentage", "Flat"], "Invalid discount type"),

  description: yup
    .string()
    .trim()
    .required("Description is required")
    .max(70, "Description can be up to 70 characters"),

  discountValue: yup
    .number()
    .typeError("Discount value must be a number")
    .positive("Discount must be greater than 0")
    .when("discountType", {
      is: "Percentage",
      then: (schema) =>
        schema.max(100, "Percentage discount cannot exceed 100%"),
      otherwise: (schema) => schema.max(100000, "Flat discount seems too high"),
    })
    .required("Discount value is required"),

  minPurchaseAmount: yup
    .number()
    .typeError("Minimum purchase must be a number")
    .positive("Minimum purchase must be greater than 0")
    .required("Minimum purchase value is required"),

  scope: yup
    .string()
    .required("Scope is required")
    .oneOf(["User", "First Order", "Global"], "Invalid scope"),

  usageLimit: yup
    .number()
    .typeError("Usage limit must be a number")
    .integer("Usage limit must be an integer")
    .positive("Usage limit must be greater than 0")
    .required("Usage limit is required"),

  startDate: yup
    .date()
    .typeError("Start date is required")
    .required("Start date is required"),

  expiryDate: yup
    .date()
    .typeError("Expiry date is required")
    .required("Expiry date is required")
    .min(yup.ref("startDate"), "Expiry date must be after start date"),
});

export const addMoneySchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .min(100, "Minimum amount is ₹100")
    .max(50000, "Maximum amount is ₹50,000")
    .required("Amount is required"),
});

export const homeSlidesSchema = yup.object().shape({
  description: yup
    .string()
    .required("Description is required")
    .min(5, "Description should be at least 5 characters"),
  link: yup.string().required("Link is required"),
});
