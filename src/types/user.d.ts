export type User = {
  user: {
    id: string;
  };
  client: {
      name: string;
      balance: number;
      pin: number;
    };
};