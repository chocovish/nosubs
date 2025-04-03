"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema, paymentMethodSchema } from "@/lib/validations/profile";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: unknown) {
  const user = await auth();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedData = profileSchema.parse(data);

  await prisma.user.update({
    where: { id: user.id },
    data: validatedData,
  });

  revalidatePath("/myprofile");
}

export async function addPaymentMethod(data: unknown) {
  const user = await auth();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedData = paymentMethodSchema.parse(data);

  // If this is the first payment method, make it default
  const existingMethods = await prisma.paymentMethod.count({
    where: { userId: user.id },
  });

  if (existingMethods === 0) {
    validatedData.isDefault = true;
  }

  await prisma.paymentMethod.create({
    data: {
      ...validatedData,
      details: JSON.stringify(validatedData.details),
      userId: user.id,
    },
  });

  revalidatePath("/myprofile");
}

export async function getPaymentMethods() {
  const user = await auth();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const methods = await prisma.paymentMethod.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return methods.map(method => ({
    ...method,
    details: JSON.parse(method.details),
  }));
} 

export async function getUserProfile(){
  const user = await auth();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  });
  return profile;
}

export async function getUserBySlug(slug: string) {
  const user = await prisma.user.findUnique({
    where: { shopSlug: slug },
    select: { id: true }
  });
  return user?.id;
}