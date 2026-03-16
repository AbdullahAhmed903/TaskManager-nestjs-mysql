export interface JwtPayloadData {
  id: number;
  email: string;
  role: string;
  iat: number;  
  exp: number;  
}