import { User } from './user.interface';
import { Accounts } from './accounts.interface';

// all interface of electron response

interface SignInResponse {
  result: boolean;
  user?: User;
  message?: string;
}

interface CommonResponse {
  result: boolean;
  message: string;
}

interface GetDataResponse {
  result:boolean;
  data: Array<Accounts>
}

export { SignInResponse, CommonResponse, GetDataResponse }
