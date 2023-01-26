export type ApplicationError = {
  name: string;
  message: string;
};

export type SignUpData = {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

export type SignInData = {
  email: string;
  password: string;
}
