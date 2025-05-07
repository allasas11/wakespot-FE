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