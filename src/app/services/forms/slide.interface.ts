// Types

export interface RoastLevel {
  value: string;
  label: string;
  color: string;
}

export interface CoffeeFlavor {
  acidity: number;
  aftertaste: number;
  aftertasteDescription: string;
}

export interface InfoLevel {
  value: number;
  label: string;
  icon: string;
  description: string;
  color: string;
}

export interface CoffeeIdentity {
  brand: string;
  coffeeName: string;
  beanType: string;
  origin: string;
}

export interface CoffeeRoast {
  roastLevel: string;
  brewMethod: string;
}

export interface BrewMethod {
  name: string;
  image: string;
}

export interface CoffeeSensory {
  aroma: string;
  body: number;
  flavor: string;
}

export interface CoffeeScore {
  opinion: string;
  score: number;
}

export interface CoffeeImage {
  file: File | null;
  preview: string | null;
}

export interface FullCoffeeData {
  brand: string;
  coffeeName: string;
  beanType: string;
  origin: string;
  roastLevel: string;
  brewMethod: string;
  aroma: string;
  body: number;
  acidity: number;
  flavor: string;
  aftertaste: number;
  aftertasteDescription: string;
  opinion: string;
  score: number;
}

export interface CardTastingInfo {
  brand: string;
  coffeeName: string;
  beanType: string;
  origin: string;
  roastLevel: RoastLevel;
  brewMethod: BrewMethod;
  aroma: string;
  flavor: string;
  body: InfoLevel;
  acidity: InfoLevel;
  aftertaste: InfoLevel;
  impression: string;
  score: number;
  createdAt: Date;
  image: string;
}
