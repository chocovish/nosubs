"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { paymentMethodSchema } from "@/lib/validations/profile";
import { updatePaymentMethod, getPaymentMethod } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Building, CreditCard, Landmark, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export function PaymentMethodForm() {
  const paymentMethodUpdateHistory : PaymentMethodFormValues[] = [];
  const [paymentType, setPaymentType] = useState<"bank" | "upi">("bank");
  
  useEffect(() => {
    loadPaymentMethod();
  }, []);

  const loadPaymentMethod = async () => {
    try {
      const method = await getPaymentMethod();
      if(method) {
        form.reset(method);
        setPaymentType(method.type as "bank" | "upi");
      }
    } catch (error) {
      toast.error("Failed to load payment methods");
    }
  };

  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: "bank"
    },
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "bank" || value === "upi") {
      setPaymentType(value);
      form.setValue("type", value);
    }
  };

  const onSubmit = async (data: PaymentMethodFormValues) => {
    try {
      await updatePaymentMethod(data);
      toast("Payment method added successfully");
      loadPaymentMethod();
      form.reset();
    } catch (error) {
      console.error("Failed to add payment method:", error);
      toast("Failed to add payment method");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-blue-50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 flex items-center h-16">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              Add New Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-medium text-gray-700">Payment Type</FormLabel>
                      <Tabs 
                        defaultValue={paymentType} 
                        value={paymentType}
                        onValueChange={handleTabChange}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-2 w-full bg-gray-100 p-1 rounded-lg">
                          <TabsTrigger 
                            value="bank"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
                          >
                            <Landmark className="h-4 w-4" />
                            Bank Account
                          </TabsTrigger>
                          <TabsTrigger 
                            value="upi"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                          >
                            <QrCode className="h-4 w-4" />
                            UPI
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <Tabs value={paymentType} className="w-full">
                    <TabsContent value="bank" className="mt-0">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                        <Landmark className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-gray-800">Bank Account Details</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <FormField
                          control={form.control}
                          name="details.accountNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Account Number</FormLabel>
                              <FormControl>
                                <Input {...field} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.accountName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Account Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.bankName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Bank Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.ifscCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">IFSC Code</FormLabel>
                              <FormControl>
                                <Input {...field} className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="upi" className="mt-0">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                        <QrCode className="h-5 w-5 text-purple-600" />
                        <h3 className="font-medium text-gray-800">UPI Details</h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="details.upiId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">UPI ID</FormLabel>
                            <FormControl>
                              <Input {...field} className="mt-1 border-gray-300 focus:border-purple-500 focus:ring-purple-500 transition-colors" placeholder="username@upi" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2"
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Add Payment Method
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-gradient-to-br from-white to-purple-50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 flex items-center h-16">
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <Building className="h-5 w-5" />
              Saved Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4 min-h-[200px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <QrCode className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No payment methods saved yet</p>
                <p className="text-xs mt-1">Add a payment method to see it here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 