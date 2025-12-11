interface iProductStyleId {
  id: number;
}

interface iCreateProductStyleRequest {
  name: string;
  description: string;
  isActive: boolean;
}

interface iUpdateProductStyleRequest {
  id: number;
  description: string;
  isActive: boolean;
}

interface iProductStyleList {
  productStyles: Array<iProductStyle>;
}

interface iProductStyle {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface iRemoveResponse {
  success: boolean;
}

interface Empty {}
