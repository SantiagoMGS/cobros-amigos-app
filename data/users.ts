export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  loanAmount: number;
}

export const TOTAL_DEBT = 26482221;
export const MONTHLY_RATE = 0.03199;
export const TOTAL_INSTALLMENTS = 12;

export const users: User[] = [
  {
    id: "1",
    username: "marcos",
    password: "MarcosArango123*",
    name: "Marcos Arango",
    loanAmount: 10465300,
  },
  {
    id: "2",
    username: "jair",
    password: "JairViana123*",
    name: "Jair Viana",
    loanAmount: 14585050,
  },
  {
    id: "3",
    username: "santiago",
    password: "SantiagoMartinez123*",
    name: "Santiago",
    loanAmount: TOTAL_DEBT - 10465300 - 14585050,
  },
];
