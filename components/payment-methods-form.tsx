"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { paymentMethodSchema } from "@/lib/validations/profile";
import { updatePaymentMethod, getPaymentMethod } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

export function PaymentMethodForm() {
  // const [paymentMethod, setPaymentMethod] = useState<PaymentMethodFormValues|null>(null);
  const paymentMethodUpdateHistory : PaymentMethodFormValues[] = [];
  useEffect(() => {
    loadPaymentMethod();
  }, []);

  const loadPaymentMethod = async () => {
    try {
      const method = await getPaymentMethod();
      // setPaymentMethod(method);
      method && form.reset(method);
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

  const selectedType = form.watch("type");

  const onSubmit = async (data: PaymentMethodFormValues) => {
    try {
      await updatePaymentMethod(data);
      toast("Payment method added successfully");
      loadPaymentMethod();
      form.reset();
    } catch (error) {
      console.error("Failed to add payment method:", error);
      toast("Failed to add payment method");
    } finally {
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Add New Payment Method</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="bank" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Bank Account
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="upi" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            UPI
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedType === "bank" ? (
                <>
                  <FormField
                    control={form.control}
                    name="details.accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
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
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
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
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
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
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl>
                          <Input {...field} className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="details.upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <Input {...field} className="mt-1" placeholder="username@upi" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Adding..." : "Add Payment Method"}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Saved Payment Methods</h3>
          <div className="space-y-4">
            {/* {paymentMethodUpdateHistory.map((method) => (
              <div
                key={method.id}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{method.type}</p>
                    {method.isDefault && (
                      <span className="text-sm text-green-600">Default</span>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {method.type === "bank" ? (
                    <>
                      <p>Account: {method.details.accountNumber}</p>
                      <p>Name: {method.details.accountName}</p>
                      <p>Bank: {method.details.bankName}</p>
                      <p>IFSC: {method.details.ifscCode}</p>
                    </>
                  ) : (
                    <p>UPI ID: {method.details.upiId}</p>
                  )}
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
} 