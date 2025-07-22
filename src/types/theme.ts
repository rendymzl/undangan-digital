export interface Theme {
  id: string;
  name: string;
  fontTitle: string;
  fontText: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  foregroundColor: string;
}

export const themes: Theme[] = [
  {
    id: "klasik",
    name: "Tema 1",
    fontTitle: "font-great-vibes",
    fontText: "font-lato",
    primaryColor: "#8B6F47",
    secondaryColor: "#EAD7C3",
    backgroundColor: "#F8F5F0",
    foregroundColor: "#3E2C18",
  },
  {
    id: "modern",
    name: "Tema 2",
    fontTitle: "font-montserrat",
    fontText: "font-inter",
    primaryColor: "#1A202C",
    secondaryColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    foregroundColor: "#1A202C",
  },
  {
    id: "floral",
    name: "Tema 3",
    fontTitle: "font-dancing-script",
    fontText: "font-roboto",
    primaryColor: "#C97B63",
    secondaryColor: "#F9E5E0",
    backgroundColor: "#FFF8F3",
    foregroundColor: "#7B3F00",
  },
  {
    id: "minimalis",
    name: "Tema 4",
    fontTitle: "font-poppins",
    fontText: "font-open-sans",
    primaryColor: "#22223B",
    secondaryColor: "#9A8C98",
    backgroundColor: "#F2E9E4",
    foregroundColor: "#22223B",
  },
]; 