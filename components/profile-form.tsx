"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validations/profile";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useState } from "react";
import { User } from 'lucide-react';
import { User as UserProfile } from "@prisma/client";
import { z } from "zod";
import { uploadFile } from "@/lib/upload";
const profileSchemaForForm = profileSchema.extend({
  image: z.custom<FileList>(),
})
type ProfileFormData = z.infer<typeof profileSchema>;
type UserType = ProfileFormData["userType"];
export function ProfileForm({ user }: { user: UserProfile }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchemaForForm),
    defaultValues: {
      name: user.name ?? "",
      userType: user.userType as UserType ?? "buyer",
      shopSlug: user.shopSlug ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof profileSchemaForForm>) => {
    try {
      setIsLoading(true);
      if (data.image?.length) {
        let result = await uploadFile(data.image[0], "thumbnails");
        let payload = { ...data, image: result.fileUrl };
        await updateProfile(payload);
      } else {
        const payload = { ...data, image: user.image };
        await updateProfile(payload);
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="image">Profile Picture</Label>
          <div className="mt-2 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="object-cover h-full w-full"
                />
              ) : (
                <User className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("image")}
              className="max-w-xs"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name")}
            className="mt-1"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label>Account Type</Label>
          <RadioGroup
            defaultValue={user?.userType ?? "buyer"}
            className="mt-2"
            {...register("userType")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buyer" id="buyer" />
              <Label htmlFor="buyer">Buyer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="seller" id="seller" />
              <Label htmlFor="seller">Seller</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="shopSlug">Shop URL Slug</Label>
          <Input
            id="shopSlug"
            {...register("shopSlug")}
            className="mt-1"
            placeholder="my-shop"
          />
          {errors.shopSlug && (
            <p className="mt-1 text-sm text-red-600">{errors.shopSlug.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
} 