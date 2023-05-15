export interface ApiAuthResponse {
  result: 'ok' | 'error';
  token: string;
  user_nick: string;
}

export interface ApiAuthBody{
  email:string;
  passwd: string
}


