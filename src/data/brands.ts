export interface BrandLogo {
  id: string;
  name: string;
  logoPath?: string; // Path to local image in /public/images/brands/
  website?: string; // Optional: for linking to client's site
}

export const BRAND_LOGOS: BrandLogo[] = [
  { id: "aknan-development", name: "Akhan Development", logoPath: "/images/brands/aknan-development.svg" },
  { id: "al-hashem", name: "Al Hashem", logoPath: "/images/brands/al-hashem.svg" },
  { id: "be-group", name: "BE Group", logoPath: "/images/brands/BE-GROUB.svg" },
  { id: "el-ghazal", name: "El Ghazal", logoPath: "/images/brands/el-ghazal.svg" },
  { id: "israay", name: "Israay", logoPath: "/images/brands/israay.svg" },
  { id: "jouf-uni", name: "Jouf University", logoPath: "/images/brands/jouf-uni.svg" },
  { id: "king-khalid-uni", name: "King Khalid University", logoPath: "/images/brands/king-khalid-uni.svg" },
  { id: "lucas", name: "Lucas", logoPath: "/images/brands/lucas.svg" },
  { id: "masr-elgher", name: "Masr Elgher", logoPath: "/images/brands/masr-elgher.svg" },
  { id: "ministry-defense", name: "Ministry of Defense", logoPath: "/images/brands/ministry-of-defense.svg" },
  { id: "wardet-bayrot", name: "Wardet Bayrot", logoPath: "/images/brands/wardet-bayrot.svg" },
  { id: "zk-teco", name: "Zk TecO", logoPath: "/images/brands/Zk-TECO.svg" },
];
