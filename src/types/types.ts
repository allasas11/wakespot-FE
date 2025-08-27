import type { ItemIncludedValue } from "../config/itemsIncluded";
import type { CategoryValue } from "../config/categories";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface Location {
    _id: string;
    name: string;
    address: string;
    description: string;
    imageUrl?: string;
  }

export interface Instructor {
  _id: string;
  name: string;
  bio: string;
  imageUrl?: string;
  specialty: string;
  activeLocations: Location[];
  yearsOfExperience?: number;
  certifications: string[];
}

export interface EquipmentPackage {
  _id: string;
  name: string;
  description: string;
  price: number;
  itemsIncluded: ItemIncludedValue[];
  category: CategoryValue; 
  imageUrl?: string;
}

export interface Session {
  _id: string;
  location: Location;
  instructor?: Instructor;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: string;
}

export interface Booking {
  _id: string;
  session: Session; 
  user: User; 
  equipmentPackages: EquipmentPackage[];
  totalPrice: number;
  status: "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded";
  bookingDate: string;
}

export type Review = {
  _id: string
  user: User
  instructor: Instructor
  rating: number
  comment: string
}