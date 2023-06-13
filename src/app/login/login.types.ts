export interface ApiLoginResponse {
  result: 'ok' | 'error';
  token?: string;
  user_nick?: string;
  admin?: boolean;
  details?: string;
  active?:boolean;
}

export interface ApiLoginBody{
  email:string;
  passwd: string
}


