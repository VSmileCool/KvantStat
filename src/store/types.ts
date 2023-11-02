export interface User {
  email: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  certificateCode: string;
  password: string;
  login: string;
  isLoggedIn: boolean;
}

export interface Institute {
  name: string;
  pupils: Pupil[];
  region: string;
}

export interface Pupil {
  name: string;
  surname: string;
  lastname: string;
}
