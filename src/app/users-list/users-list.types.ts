export class User {
  id?: number
  email: string = ''
  passwd: string = ''
  nick?: string
  imageUri?: string
  token?: string
  active?: boolean | number
  admin?: boolean | number
  constructor(active:boolean = true, admin:boolean = false) {
    this.active = active;
    this.admin = admin;
  }
}

export interface GetUserResponse {
  result: string
  usuarios: User[]
}

export interface StateOptions {
  label: string
  value: boolean
}

export interface UpdateUserBody {
  admin: boolean
  active: boolean
}

export interface Response {
  result?: 'ok' | 'error'
  details?: string
}
