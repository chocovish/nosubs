"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validations/profile";
import { updateProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { User, UserCircle, Store, Save, Upload, ShoppingCart, LayoutGrid } from 'lucide-react';
import { User as UserProfile } from "@prisma/client";
import { z } from "zod";
import { uploadFile } from "@/lib/upload";
import { useUserProfileQuery, useInvalidateUserData } from "@/hooks/use-user-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const profileSchemaForForm = profileSchema.extend({
  image: z.custom<FileList>(),
})
type ProfileFormData = z.infer<typeof profileSchema>;
type UserType = ProfileFormData["userType"];
export function ProfileForm() {
  const { data: user, isLoading } = useUserProfileQuery();
  const { invalidateUserProfile } = useInvalidateUserData();
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name!,
        userType: user.userType,
        shopSlug: user.shopSlug!,
      });
      setAccountType(user.userType as "buyer" | "seller");
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchemaForForm),
    defaultValues: {
      userType: "buyer"
    },
  });

  // Handle tab change
  const handleAccountTypeChange = (value: string) => {
    if (value === "buyer" || value === "seller") {
      setAccountType(value);
      setValue("userType", value);
    }
  };

  const onSubmit = async (data: z.infer<typeof profileSchemaForForm>) => {
    try {
      if (data.image?.length) {
        const result = await uploadFile(data.image[0], "thumbnails");
        const payload = { ...data, image: result.fileUrl };
        await updateProfile(payload);
      } else {
        const payload = { ...data, image: user?.image };
        await updateProfile(payload);
      }
      invalidateUserProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-white to-blue-50 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 flex items-center h-16">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <UserCircle className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="max-sm:px-2 max-sm:pt-1 md:pt-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-gray-800">Personal Details</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="image" className="text-sm font-medium text-gray-700">Profile Picture</Label>
                    <div className="mt-3 flex items-center gap-5">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <User className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            {...register("image")}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                setSelectedFileName(files[0].name);
                              } else {
                                setSelectedFileName(null);
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 py-2 border-dashed border-2"
                          >
                            <Upload className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 truncate max-w-[180px] sm:max-w-[250px]">
                              {selectedFileName ? selectedFileName : "Upload new photo"}
                            </span>
                          </Button>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Recommended: Square JPG or PNG, at least 300x300px
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <Store className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium text-gray-800">Account Settings</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Type</Label>
                    <div className="mt-3">
                      <input
                        type="hidden"
                        {...register("userType")}
                        value={accountType}
                      />
                      <Tabs 
                        defaultValue={accountType} 
                        value={accountType} 
                        onValueChange={handleAccountTypeChange}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 rounded-lg">
                          <TabsTrigger 
                            value="buyer"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Buyer
                          </TabsTrigger>
                          <TabsTrigger 
                            value="seller"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                          >
                            <LayoutGrid className="h-4 w-4" />
                            Seller
                          </TabsTrigger>
                        </TabsList>
                        <div className="mt-4 space-y-4">
                          <TabsContent value="buyer" className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-0">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500 rounded-full">
                                <ShoppingCart className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-blue-900">Buyer Account</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                  Create orders and purchase products
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="seller" className="p-4 bg-purple-50 rounded-lg border border-purple-100 mt-0">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-500 rounded-full">
                                <LayoutGrid className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium text-purple-900">Seller Account</h4>
                                <p className="text-sm text-purple-700 mt-1">
                                  List products and receive payments
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                        </div>
                      </Tabs>
                    </div>
                  </div>

                  {accountType === "seller" && (
                    <div>
                      <Label htmlFor="shopSlug" className="text-sm font-medium text-gray-700">Shop URL Slug</Label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          nosubs.com/shop/
                        </span>
                        <Input
                          id="shopSlug"
                          {...register("shopSlug")}
                          className="rounded-none rounded-r-md focus:border-blue-500 focus:ring-blue-500 transition-colors"
                          placeholder="my-shop"
                        />
                      </div>
                      {errors.shopSlug && (
                        <p className="mt-1 text-sm text-red-600">{errors.shopSlug.message}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        This will be used for your shop's public URL. Use only letters, numbers, and hyphens.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 