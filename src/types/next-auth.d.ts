import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id:          string;
      name:        string;
      email:       string;
      role:        string;
      roleSelected: boolean;
      city:        string;
      xp:          number;
      companyName?: string;
      companyLogo?: string;
    };
  }
}