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

export async function updatePaymentMethod(data: unknown) {
  const user = await auth();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const validatedData = paymentMethodSchema.parse(data);

  // Use a transaction to ensure both operations succeed or fail together
  const result = await prisma.$transaction(async (tx) => {
    // Update or create payment method
    const paymentMethod = await tx.paymentMethod.upsert({
      where: { userId: user.id },
      update: {
        ...validatedData,
        details: validatedData.details,
      },
      create: {
        ...validatedData,
        details: validatedData.details,
        userId: user.id,
      },
    });

    // Create history entry
    await tx.paymentMethodHistory.create({
      data: {
        paymentMethodId: paymentMethod.id,
        type: validatedData.type,
        details: validatedData.details,
      },
    });

    return paymentMethod;
  });

  revalidatePath("/myprofile");
  return result;
}

export async function getPaymentMethod() {
  const user = await auth();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const method = await prisma.paymentMethod.findUnique({
    where: { userId: user.id }
  });
  return method;
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

export async function getPaymentMethodHistory() {
  const user = await auth();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const history = await prisma.paymentMethodHistory.findMany({
    where: {
      paymentMethod: {
        userId: user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      paymentMethod: true,
    },
  });

  return history;
}