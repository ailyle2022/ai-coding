interface iProductStyleId {
  id: number;
}

interface iCreateProductStyleRequest {
  name: string;
  description: string;
  is_active: boolean;
}

interface iUpdateProductStyleRequest {
  id: number;
  description: string;
  is_active: boolean;
}

interface iProductStyleList {
  product_styles: Array<iProductStyle>;
}

interface iProductStyle {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface iRemoveResponse {
  success: boolean;
}

interface Empty {}
