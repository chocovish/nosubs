export declare global {
    namespace PrismaJson {
        export type BankDetailsType = {
            accountNumber: string;
            accountName: string;
            bankName: string;
            ifscCode: string;
        }
        export type UPIDetailsType = {
            upiId: string;
        }
        export type PaymentMethodStringType = "bank" | "upi"
        export type PaymentMethodType = BankDetailsType|UPIDetailsType
        export type UserType = "buyer" | "seller"
    }
}

declare global {
    namespace PrismaJson {
      type MyType = boolean;
      type ComplexType = { foo: string; bar: number };
    }
  }