import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  userType: z.enum(["buyer", "seller"]),
  shopSlug: z.string().min(3, "Shop slug must be at least 3 characters").optional(),
  image: z.string().optional(),
});

export const bankDetailsSchema = z.object({
  accountNumber: z.string().min(10, "Account number must be at least 10 characters"),
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  ifscCode: z.string().min(11, "IFSC code must be 11 characters").max(11, "IFSC code must be 11 characters"),
});

export const upiDetailsSchema = z.object({
  upiId: z.string().min(5, "UPI ID must be at least 5 characters"),
});

export const paymentMethodSchema = z.object({
  type: z.enum(["bank", "upi"]),
  details: z.union([bankDetailsSchema, upiDetailsSchema]),
  isDefault: z.boolean().default(false),
}); 