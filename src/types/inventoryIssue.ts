// ============= PRODUCT SUGGESTION =============
export interface ProductSuggestion {
  id: string;
  code: string;
  name: string;
  unit: string;
  availableQty: number;
  unitPrice: number;
  nearestExpiry: string | null;
}

// ============= INVENTORY ISSUE ITEM =============
export interface InventoryIssueItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

// ============= LOT ALLOCATION =============
export interface LotAllocation {
  inventoryLotId: string;
  lotNumber: string;
  expiryDate: string;
  quantity: number;
  unitCost: number;
}

// ============= INVENTORY ISSUE DETAIL =============
export interface InventoryIssueDetail {
  productId: string;
  totalQuantity: number;
  unitPrice: number;
  lineTotal: number;
  lotAllocations: LotAllocation[];
}

// ============= INVENTORY ISSUE =============
export interface InventoryIssue {
  id: string;
  issueCode: string;
  warehouseId: string;
  department: string;
  issueDate: string;
  notes: string;
  details: InventoryIssueDetail[];
  totalAmount: number;
  status: "draft" | "confirmed" | "cancelled";
  createdBy: string;
  confirmedBy: string | null;
  confirmedAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

// ============= CREATE REQUEST =============
export interface CreateInventoryIssueRequest {
  warehouseId: string;
  department: string;
  issueDate: string;
  notes?: string;
  items: InventoryIssueItemInput[];
}

// ============= API RESPONSES =============
export interface ProductSuggestionsResponse {
  success: true;
  message: string;
  data: ProductSuggestion[];
  statusCode: 200;
}

export interface CreateInventoryIssueResponse {
  success: true;
  message: string;
  data: InventoryIssue;
  statusCode: 201;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: string[];
}
