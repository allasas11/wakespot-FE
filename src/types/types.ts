import type { ItemIncludedValue } from "../config/itemsIncluded";
import type { CategoryValue } from "../config/categories";

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