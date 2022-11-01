export interface UserState {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubject {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClass {
  id: string;
  className: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITerm {
  id: string;
  startYear: number;
  endYear: number;
  term: number;
}

export interface ISOW {
  id: string;
  subject: ISubject;
  class: IClass;
  term: ITerm;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
