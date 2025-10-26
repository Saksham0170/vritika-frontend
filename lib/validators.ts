import { z } from "zod"

// Basic validation schemas
export const emailSchema = z.string().email("Please enter a valid email address")
export const phoneSchema = z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number")
export const nameSchema = z.string().min(2, "Name must be at least 2 characters").max(50, "Name must not exceed 50 characters").regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(100, "Password must not exceed 100 characters")

// Indian-specific validation helper functions

/**
 * Validates Indian PAN (Permanent Account Number)
 * Format: ABCDE1234F (5 letters + 4 digits + 1 letter)
 */
export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan.toUpperCase())
}

/**
 * Validates Indian Aadhaar number
 * Format: 12 digits, cannot start with 0 or 1
 */
export const isValidAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^[2-9]\d{11}$/
  const cleanAadhaar = aadhaar.replace(/\s/g, '') // Remove spaces
  return aadhaarRegex.test(cleanAadhaar)
}

/**
 * Validates Indian IFSC (Indian Financial System Code)
 * Format: ABCD0123456 (4 letters + 1 digit (0) + 6 alphanumeric)
 */
export const isValidIFSC = (ifsc: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  return ifscRegex.test(ifsc.toUpperCase())
}

/**
 * Validates Indian PIN code
 * Format: 6 digits, cannot start with 0
 */
export const isValidPINCode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9]\d{5}$/
  return pincodeRegex.test(pincode)
}

/**
 * Validates Indian GST number
 * Format: 15 characters - 2 digits (state) + 10 characters (PAN) + 1 digit (entity) + 1 character (Z) + 1 check digit
 */
export const isValidGST = (gst: string): boolean => {
  const gstRegex = /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/
  return gstRegex.test(gst.toUpperCase())
}

/**
 * Validates Indian bank account number
 * Format: 9-18 digits
 */
export const isValidBankAccount = (account: string): boolean => {
  const accountRegex = /^\d{9,18}$/
  return accountRegex.test(account)
}

// Zod schemas with Indian validations
export const panSchema = z.string()
  .min(10, "PAN must be 10 characters")
  .max(10, "PAN must be 10 characters")
  .refine(isValidPAN, "Please enter a valid PAN number (e.g., ABCDE1234F)")

export const aadhaarSchema = z.string()
  .min(12, "Aadhaar must be 12 digits")
  .max(12, "Aadhaar must be 12 digits")
  .refine(isValidAadhaar, "Please enter a valid Aadhaar number")

export const ifscSchema = z.string()
  .min(11, "IFSC must be 11 characters")
  .max(11, "IFSC must be 11 characters")
  .refine(isValidIFSC, "Please enter a valid IFSC code (e.g., SBIN0000123)")

export const pincodeSchema = z.string()
  .min(6, "PIN code must be 6 digits")
  .max(6, "PIN code must be 6 digits")
  .refine(isValidPINCode, "Please enter a valid PIN code")

export const gstSchema = z.string()
  .min(15, "GST number must be 15 characters")
  .max(15, "GST number must be 15 characters")
  .refine(isValidGST, "Please enter a valid GST number")

export const bankAccountSchema = z.string()
  .min(9, "Bank account number must be at least 9 digits")
  .max(18, "Bank account number must not exceed 18 digits")
  .refine(isValidBankAccount, "Please enter a valid bank account number")

// Common form schemas
export const adminFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema.optional(),
  adminType: z.enum(["Individual", "Organisation"]),
  gstNo: gstSchema.optional(),
  contactPersonName: z.string().optional(),
  address: z.string().min(10, "Address must be at least 10 characters"),
  aadharCardNo: aadhaarSchema,
  panCardNo: panSchema,
  bankAccountNo: bankAccountSchema,
  ifscCode: ifscSchema,
  bankHolderName: nameSchema,
})

export const subAdminFormSchema = adminFormSchema

export const salespersonFormSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  phoneNumber: phoneSchema,
  password: passwordSchema.optional(),
  address: z.string().min(10, "Address must be at least 10 characters").optional(),
  aadharCardNumber: aadhaarSchema.optional(),
  panCardNumber: panSchema.optional(),
  bankAccountNumber: bankAccountSchema.optional(),
  bankIfscCode: ifscSchema.optional(),
  bankAccountName: nameSchema.optional(),
})

export const brandFormSchema = z.object({
  brandName: z.string().min(2, "Brand name must be at least 2 characters").max(50, "Brand name must not exceed 50 characters"),
  brandDetails: z.string().min(10, "Brand details must be at least 10 characters"),
  quality: z.string().min(1, "Please select a quality"),
  productCategory: z.array(z.string()).min(1, "Please select at least one product category"),
})

export const productFormSchema = z.object({
  productName: z.string().min(2, "Product name must be at least 2 characters"),
  type: z.string().min(1, "Please select a product type"),
  spvBrand: z.string().optional(),
  spvType: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  sellinPrice: z.number().min(0, "Selling price must be a positive number"),
  description: z.string().optional(),
})

export const couponFormSchema = z.object({
  couponCode: z.string().min(3, "Coupon code must be at least 3 characters").max(20, "Coupon code must not exceed 20 characters"),
  discountPercentage: z.number().min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  validFrom: z.string().min(1, "Please select a valid from date"),
  validTo: z.string().min(1, "Please select a valid to date"),
})

// Type exports for form data
export type AdminFormData = z.infer<typeof adminFormSchema>
export type SubAdminFormData = z.infer<typeof subAdminFormSchema>
export type SalespersonFormData = z.infer<typeof salespersonFormSchema>
export type BrandFormData = z.infer<typeof brandFormSchema>
export type ProductFormData = z.infer<typeof productFormSchema>
export type CouponFormData = z.infer<typeof couponFormSchema>