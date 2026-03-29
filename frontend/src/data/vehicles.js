// Vehicle data for MVP - Can be replaced with API calls later
export const DEMO_VEHICLES = [
  {
    id: "1",
    marque: "Toyota",
    modele: "Harrier",
    prix: 15000,
    localisation: "Kinshasa",
    annee: 2019,
    carburant: "Essence",
    transmission: "Automatique",
    statut: "Disponible",
    images: [
      "https://images.unsplash.com/photo-1758216991743-110e7a093f29?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBsdXh1cnklMjBzdXYlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc0ODEzNzQyfDA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"
    ],
    contact: "243975814951",
    kilometrage: 45000,
    description: "Toyota Harrier en excellent état, bien entretenu avec carnet de bord complet."
  },
  {
    id: "2",
    marque: "Mercedes-Benz",
    modele: "G-Wagon",
    prix: 85000,
    localisation: "Lubumbashi",
    annee: 2021,
    carburant: "Diesel",
    transmission: "Automatique",
    statut: "Disponible",
    images: [
      "https://images.unsplash.com/photo-1761757414353-44a9718106f7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBsdXh1cnklMjBzdXYlMjBvbiUyMHJvYWR8ZW58MHx8fHwxNzc0ODEzNzQyfDA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
    ],
    contact: "243975814951",
    kilometrage: 12000,
    description: "Mercedes G-Wagon luxueux, intérieur cuir, toutes options incluses."
  },
  {
    id: "3",
    marque: "Land Rover",
    modele: "Range Rover Sport",
    prix: 42000,
    localisation: "Kinshasa",
    annee: 2020,
    carburant: "Diesel",
    transmission: "Automatique",
    statut: "Vendu",
    images: [
      "https://images.pexels.com/photos/33390082/pexels-photo-33390082.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"
    ],
    contact: "243975814951",
    kilometrage: 38000,
    description: "Range Rover Sport en parfait état, jantes 22 pouces, toit panoramique."
  }
];

export const LOCATIONS = ["Kinshasa", "Lubumbashi", "Goma"];
export const FUEL_TYPES = ["Essence", "Diesel"];
export const TRANSMISSIONS = ["Automatique", "Manuelle"];
export const STATUS_OPTIONS = ["Disponible", "Vendu"];

export const DEFAULT_WHATSAPP = "243975814951";
