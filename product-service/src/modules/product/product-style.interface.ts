interface ProductStyleId {
  id: number;
}

interface CreateProductStyleRequest {
  name: string;
  description: string;
  is_active: boolean;
}

interface UpdateProductStyleRequest {
  id: number;
  description: string;
  is_active: boolean;
}

interface ProductStyleList {
  product_styles: Array<{
    id: number;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

interface RemoveResponse {
  success: boolean;
}

interface Empty {
}