export class User {
  id?: number = 0
  email: string = ''
  passwd: string = ''
  nick?: string
  imageUri?: string
  token?: string
  active?: boolean |number
  admin?: boolean | number

}

export interface GetUserResponse {
  result: string
  usuarios: User[]
}

export interface StateOptions {
  label: string
  value: boolean
}

export interface UpdateUserBody{
  admin:boolean
  active:boolean
}

export interface Response{
  result?: 'ok'|'error'
  details?: string
}
