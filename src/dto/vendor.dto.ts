export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  foods: any;
}

export interface VendorLoginInput {
  email: string;
  password: string;
}

export interface EditVendorInput {
  name: string;
  address: string;
  phone: string;
  foodType: [string];
}

export interface VendorPayload {
  _id: string;
  name: string;
  email: string;
  foodType: [string];
}
