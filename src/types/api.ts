/**
 * EngineerBiz API Types & Enums
 * Direct mapping from Spring Boot OpenAPI specification
 */

// ==========================================
// ENUMS
// ==========================================

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'PROJECT_MANAGER'
  | 'ENGINEER'
  | 'ACCOUNTANT'
  | 'PROCUREMENT_OFFICER'
  | 'STAFF';

export type UserStatus = 'INVITED' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type ClientType = 'INDIVIDUAL' | 'CORPORATE' | 'GOVERNMENT' | 'JOINT_VENTURE';
export type ClientStatus = 'PROSPECT' | 'ACTIVE' | 'DORMANT' | 'BLACKLISTED';

export type ServiceCategory =
  | 'STRUCTURAL_DESIGN'
  | 'MEP_DESIGN'
  | 'CIVIL_INFRASTRUCTURE'
  | 'GEOTECHNICAL'
  | 'PROJECT_MANAGEMENT'
  | 'CONSTRUCTION_SUPERVISION'
  | 'TOPOGRAPHICAL_SURVEY'
  | 'ARCHITECTURAL_COORDINATION';

export type ProjectStatus =
  | 'PLANNING'
  | 'BIDDING'
  | 'DESIGN_PHASE'
  | 'PERMITTING'
  | 'UNDER_CONSTRUCTION'
  | 'ON_HOLD'
  | 'HANDOVER'
  | 'DEFECTS_LIABILITY'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProjectRole =
  | 'PROJECT_MANAGER'
  | 'PROJECT_ENGINEER'
  | 'STRUCTURAL_ENGINEER'
  | 'MEP_ENGINEER'
  | 'SITE_ENGINEER'
  | 'QA_QC_ENGINEER'
  | 'QUANTITY_SURVEYOR'
  | 'SAFETY_OFFICER'
  | 'CONSULTANT';

export type UnitOfMeasure =
  | 'M'
  | 'M2'
  | 'M3'
  | 'KG'
  | 'TON'
  | 'BAG'
  | 'LS'
  | 'SET'
  | 'TRIP'
  | 'DAY'
  | 'MONTH'
  | 'MAN_DAY';

export type EstimateStatus =
  | 'DRAFT'
  | 'INTERNAL_REVIEW'
  | 'MANAGEMENT_APPROVED'
  | 'QUOTED'
  | 'REVISED'
  | 'SUPERSEDED'
  | 'APPROVED';

export type QuotationStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'SENT_TO_CLIENT'
  | 'CLIENT_ACCEPTED'
  | 'CLIENT_REJECTED'
  | 'EXPIRED'
  | 'SUPERSEDED';

export type ContractType =
  | 'LUMP_SUM'
  | 'UNIT_PRICE_REMEASUREMENT'
  | 'COST_PLUS_FEE'
  | 'DESIGN_AND_BUILD'
  | 'CONSULTANCY_TIME_BASED';

export type ContractStatus =
  | 'DRAFT'
  | 'PENDING_SIGNATURE'
  | 'ACTIVE'
  | 'VARIATION_PENDING'
  | 'COMPLETED'
  | 'SUSPENDED'
  | 'TERMINATED';

export type AmendmentStatus =
  | 'PROPOSED'
  | 'REVIEWED'
  | 'CLIENT_APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type InvoiceType =
  | 'ADVANCE_PAYMENT'
  | 'PROGRESS_CLAIM'
  | 'RETENTION_RELEASE'
  | 'FINAL_SETTLEMENT'
  | 'VARIATION_CLAIM';

export type InvoiceStatus =
  | 'DRAFT'
  | 'ISSUED'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'DISPUTED'
  | 'VOID';

export type PaymentMethod =
  | 'BANK_TRANSFER'
  | 'CHEQUE'
  | 'CASH'
  | 'BAKONG_KHQR';

export type PaymentStatus =
  | 'PENDING_CLEARANCE'
  | 'CONFIRMED'
  | 'BOUNCED'
  | 'REVERSED';

export type ExpenseCategory =
  | 'RAW_MATERIALS'
  | 'EQUIPMENT_RENTAL'
  | 'SUBCONTRACTOR_WORK'
  | 'SITE_LABOR_WAGES'
  | 'PERMITS_LICENSES'
  | 'SITE_OFFICE_UTILITIES'
  | 'TRANSPORTATION'
  | 'CONSULTANT_FEES'
  | 'MISCELLANEOUS';

export type ExpenseStatus =
  | 'SUBMITTED'
  | 'VERIFIED_BY_QS'
  | 'APPROVED_BY_PM'
  | 'REIMBURSED'
  | 'REJECTED';

export type EquipmentStatus =
  | 'AVAILABLE_IN_YARD'
  | 'DEPLOYED_ON_SITE'
  | 'UNDER_MAINTENANCE'
  | 'REPAIR_REQUIRED'
  | 'DECOMMISSIONED';

export type MovementType =
  | 'PURCHASE_RECEIPT'
  | 'DISPATCH_TO_SITE'
  | 'RETURN_FROM_SITE'
  | 'STOCK_ADJUSTMENT_PLUS'
  | 'STOCK_ADJUSTMENT_SCRAP'
  | 'TRANSFER_BETWEEN_SITES';

export type DocumentType =
  | 'ARCHITECTURAL_DRAWING'
  | 'STRUCTURAL_DRAWING'
  | 'MEP_DRAWING'
  | 'SOIL_TEST_REPORT'
  | 'BOQ_WORKSHEET'
  | 'SIGNED_CONTRACT'
  | 'VARIATION_ORDER'
  | 'BUILDING_PERMIT'
  | 'SITE_PROGRESS_PHOTO'
  | 'INVOICE_RECEIPT'
  | 'COMPLETION_CERTIFICATE'
  | 'OTHER';

// ==========================================
// COMMON API WRAPPERS
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ==========================================
// AUTH & USERS
// ==========================================

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  jobTitle?: string;
  avatarUrl?: string | null;
  status: UserStatus;
  role: UserRole;
  lastLoginAt?: string | null;
  permissions: string[];
  createdAt: string;
  mustChangePassword?: boolean;
  activatedAt?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: UserResponse;
}

export interface PermissionResponse {
  id: string;
  code: string;
  name: string;
  module: string;
  description: string;
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  phone?: string;
  jobTitle?: string;
  role: UserRole;
  permissionIds?: string[];
}

export interface UpdateUserRequest {
  fullName: string;
  phone?: string;
  jobTitle?: string;
}

// ==========================================
// DASHBOARD
// ==========================================

export interface DashboardSummaryResponse {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;

  totalContractValue: number;
  totalInvoiced: number;
  totalCollected: number;
  totalOutstandingBalance: number;
  totalExpenses: number;

  totalEquipmentCount: number;
  deployedEquipmentCount: number;
  availableEquipmentCount: number;

  totalMaterialsCount: number;
  lowStockMaterialCount: number;

  pendingExpenseApprovalCount: number;
}

// ==========================================
// CLIENT
// ==========================================

export interface ClientResponse {
  id: string;
  clientCode: string;
  name: string;
  nameKhmer?: string;
  clientType: ClientType;
  status: ClientStatus;
  vatTin?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
  billingAddress?: string;
  city?: string;
  paymentTermDays?: number;
  creditLimit?: number;
  notes?: string;
  totalProjects?: number;
  totalContractValue?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateClientRequest {
  name: string;
  nameKhmer?: string;
  clientType: ClientType;
  vatTin?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone: string;
  billingAddress?: string;
  city?: string;
  paymentTermDays?: number;
  creditLimit?: number;
  notes?: string;
}

export interface UpdateClientRequest {
  name: string;
  nameKhmer?: string;
  clientType: ClientType;
  status: ClientStatus;
  vatTin?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  primaryContactPhone: string;
  billingAddress?: string;
  city?: string;
  paymentTermDays?: number;
  creditLimit?: number;
  notes?: string;
}

// ==========================================
// ENGINEERING SERVICES
// ==========================================

export interface EngineeringServiceResponse {
  id: string;
  code: string;
  name: string;
  nameKh?: string;
  category: ServiceCategory;
  description?: string;
  standardRate: number;
  currency: string;
  unitOfMeasure: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEngineeringServiceRequest {
  code: string;
  name: string;
  nameKh?: string;
  category: ServiceCategory;
  description?: string;
  standardRate: number;
  currency: string;
  unitOfMeasure: string;
}

export interface UpdateEngineeringServiceRequest {
  name: string;
  nameKh?: string;
  category: ServiceCategory;
  description?: string;
  standardRate: number;
  currency: string;
  unitOfMeasure: string;
  isActive: boolean;
}

// ==========================================
// PROJECTS
// ==========================================

export interface ProjectResponse {
  id: string;
  clientId: string;
  clientName?: string;
  primaryServiceId?: string;
  primaryServiceName?: string;
  projectCode: string;
  name: string;
  description?: string;
  location?: string;
  city?: string;
  startDate?: string;
  targetEndDate?: string;
  actualEndDate?: string;
  status: ProjectStatus;
  contractValue: number;
  estimatedBudget: number;
  currency?: string;
  completionPercentage: number;
  progressPercentage?: number;
  projectManagerId?: string;
  projectManagerName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  clientId: string;
  primaryServiceId?: string;
  name: string;
  description?: string;
  location?: string;
  city?: string;
  startDate?: string;
  targetEndDate?: string;
  contractValue?: number;
  estimatedBudget: number;
  currency?: string;
  projectManagerId?: string;
}

export interface UpdateProjectRequest {
  name: string;
  description?: string;
  location?: string;
  city?: string;
  startDate?: string;
  targetEndDate?: string;
  contractValue?: number;
  estimatedBudget: number;
  currency?: string;
  projectManagerId?: string;
}

export interface ProjectMemberResponse {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userJobTitle?: string;
  role: ProjectRole;
  assignedAt: string;
}

export interface AddProjectMemberRequest {
  userId: string;
  role: ProjectRole;
}

export interface ProjectProgressResponse {
  id: string;
  projectId: string;
  progressPercentage: number;
  reportDate: string;
  remarks?: string;
  recordedByUserId: string;
  recordedByName?: string;
  createdAt: string;
}

export interface RecordProgressRequest {
  progressPercentage: number;
  reportDate: string;
  remarks?: string;
}

export interface ProjectStatusHistoryResponse {
  id: string;
  projectId: string;
  fromStatus?: ProjectStatus;
  toStatus: ProjectStatus;
  remarks?: string;
  changedByUserId: string;
  changedByName?: string;
  createdAt: string;
}

// ==========================================
// BOQ & ESTIMATES
// ==========================================

export interface EstimateItemResponse {
  id: string;
  estimateId: string;
  itemCode: string;
  itemNumber?: string;
  description: string;
  unitOfMeasure: UnitOfMeasure;
  unit?: string;
  quantity: number;
  unitRateDirectCost: number;
  subtotalDirectCost: number;
  directCost?: number;
  totalCost?: number;
  notes?: string;
}

export interface EstimateResponse {
  id: string;
  estimateCode: string;
  projectId: string;
  projectName?: string;
  title: string;
  description?: string;
  status: EstimateStatus;
  version: number;
  totalDirectCost: number;
  totalIndirectCost: number;
  profitMarginRate: number;
  marginPercentage?: number;
  totalEstimatedAmount: number;
  currency?: string;
  approvedByUserId?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  items?: EstimateItemResponse[];
}

export interface CreateEstimateItemRequest {
  itemCode?: string;
  itemNumber?: string;
  description: string;
  unitOfMeasure?: UnitOfMeasure;
  unit?: string;
  quantity: number;
  unitRateLabor?: number;
  unitRateMaterial?: number;
  unitRateEquipment?: number;
  unitRateSubcontractor?: number;
  directCost?: number;
  markupPercentage?: number;
  notes?: string;
  displayOrder?: number;
}

export interface CreateEstimateRequest {
  projectId: string;
  title: string;
  description?: string;
  profitMarginRate: number;
  totalIndirectCost?: number;
  currency?: string;
  items: CreateEstimateItemRequest[];
}

export interface UpdateEstimateRequest {
  title: string;
  description?: string;
  profitMarginRate: number;
  totalIndirectCost?: number;
  currency?: string;
  items: CreateEstimateItemRequest[];
}

// ==========================================
// QUOTATIONS
// ==========================================

export interface QuotationItemResponse {
  id: string;
  quotationId: string;
  itemCode?: string;
  description: string;
  unitOfMeasure: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  totalPrice?: number;
}

export interface QuotationResponse {
  id: string;
  quotationNumber: string;
  quotationCode?: string;
  projectId: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  estimateId?: string;
  status: QuotationStatus;
  issueDate: string;
  validUntil: string;
  subtotalAmount: number;
  subtotal?: number;
  discountRate: number;
  discountAmount: number;
  taxRate: number;
  vatPercentage?: number;
  taxAmount: number;
  grandTotal: number;
  totalAmount?: number;
  currency?: string;
  paymentTerms?: string;
  scopeOfWork?: string;
  createdAt: string;
  items?: QuotationItemResponse[];
}

export interface CreateQuotationItemRequest {
  itemCode?: string;
  description: string;
  unitOfMeasure?: string;
  unit?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateQuotationRequest {
  projectId: string;
  estimateId?: string;
  issueDate: string;
  validUntil: string;
  discountRate?: number;
  taxRate?: number;
  currency?: string;
  paymentTerms?: string;
  scopeOfWork?: string;
  items: CreateQuotationItemRequest[];
}

export interface UpdateQuotationRequest {
  validUntil: string;
  discountRate?: number;
  taxRate?: number;
  paymentTerms?: string;
  scopeOfWork?: string;
  items: CreateQuotationItemRequest[];
}

// ==========================================
// CONTRACTS
// ==========================================

export interface ContractAmendmentResponse {
  id: string;
  contractId: string;
  amendmentNumber: string;
  voNumber?: string;
  title: string;
  scopeDescription: string;
  scopeChanges?: string;
  valueChange: number;
  costImpact?: number;
  newContractValue: number;
  timeExtensionDays: number;
  scheduleImpactDays?: number;
  status: AmendmentStatus;
  approvedByUserId?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface ContractResponse {
  id: string;
  contractCode: string;
  contractNumber?: string;
  projectId: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  title: string;
  contractType: ContractType;
  type?: ContractType;
  status: ContractStatus;
  originalValue: number;
  contractValue?: number;
  currentValue: number;
  retentionPercentage: number;
  taxRate: number;
  effectiveDate: string;
  startDate?: string;
  completionDate: string;
  endDate?: string;
  signedDate?: string;
  currency?: string;
  termsAndConditions?: string;
  createdAt: string;
  amendments?: ContractAmendmentResponse[];
}

export interface CreateContractRequest {
  projectId: string;
  contractNumber?: string;
  title: string;
  contractType: ContractType;
  signedDate?: string;
  effectiveDate: string;
  completionDate: string;
  originalValue: number;
  retentionPercentage?: number;
  taxRate?: number;
  currency?: string;
  termsAndConditions?: string;
}

export interface UpdateContractRequest {
  title: string;
  contractType: ContractType;
  effectiveDate: string;
  completionDate: string;
  signedDate?: string;
  originalValue: number;
  retentionPercentage?: number;
  termsAndConditions?: string;
}

export interface CreateAmendmentRequest {
  title: string;
  reason: string;
  amountAdjustment: number;
  daysExtension: number;
}

// ==========================================
// FINANCE (INVOICES & EXPENSES)
// ==========================================

export interface PaymentResponse {
  id: string;
  invoiceId: string;
  receiptNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  paymentReference?: string;
  bankName?: string;
  status: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItemResponse {
  id: string;
  invoiceId: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName?: string;
  contractId?: string;
  contractTitle?: string;
  invoiceType: InvoiceType;
  type?: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotalAmount: number;
  taxRate: number;
  taxAmount: number;
  retentionRate: number;
  retentionAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  currency?: string;
  notes?: string;
  createdAt: string;
  items?: InvoiceItemResponse[];
  payments?: PaymentResponse[];
}

export interface CreateInvoiceItemRequest {
  itemCode?: string;
  description: string;
  unitOfMeasure: UnitOfMeasure;
  quantity: number;
  unitPrice: number;
  displayOrder?: number;
}

export interface CreateInvoiceRequest {
  projectId: string;
  contractId?: string;
  invoiceType: InvoiceType;
  issueDate: string;
  dueDate: string;
  retentionRate?: number;
  taxRate?: number;
  currency?: string;
  notes?: string;
  items: CreateInvoiceItemRequest[];
}

export interface RecordPaymentRequest {
  paymentDate: string;
  amount: number;
  currency?: string;
  exchangeRateToKhr?: number;
  paymentMethod: PaymentMethod;
  bankTransactionRef?: string;
  receiptNumber?: string;
  notes?: string;
}

export interface ExpenseResponse {
  id: string;
  expenseNumber: string;
  expenseCode?: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description?: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  amount: number;
  currency: string;
  expenseDate: string;
  vendorName?: string;
  invoiceReference?: string;
  notes?: string;
  approvedByUserId?: string;
  approvedByName?: string;
  paidAt?: string;
  createdAt: string;
}

export interface CreateExpenseRequest {
  projectId?: string;
  title: string;
  description?: string;
  category: ExpenseCategory;
  expenseDate: string;
  amount: number;
  currency?: string;
  vendorName?: string;
  invoiceReference?: string;
  receiptNumber?: string;
  notes?: string;
}

export interface UpdateExpenseRequest {
  title: string;
  category: ExpenseCategory;
  expenseDate: string;
  amount: number;
  vendorName?: string;
  invoiceReference?: string;
  notes?: string;
}

// ==========================================
// INVENTORY (MATERIALS & EQUIPMENT)
// ==========================================

export interface MaterialResponse {
  id: string;
  itemCode: string;
  materialCode?: string;
  name: string;
  category?: string;
  unitOfMeasure: UnitOfMeasure;
  unit?: string;
  unitCost: number;
  currency?: string;
  currentStock: number;
  reorderThreshold: number;
  minimumStock?: number;
  storageLocation?: string;
  supplierName?: string;
  createdAt: string;
}

export interface CreateMaterialRequest {
  itemCode?: string;
  materialCode?: string;
  name: string;
  category?: string;
  unitOfMeasure?: UnitOfMeasure;
  unit?: string;
  unitCost: number;
  currency?: string;
  initialStock?: number;
  currentStock?: number;
  reorderThreshold?: number;
  minimumStock?: number;
  storageLocation?: string;
  supplierName?: string;
  description?: string;
}

export interface UpdateMaterialRequest {
  name: string;
  category?: string;
  unitOfMeasure?: UnitOfMeasure;
  unit?: string;
  unitCost: number;
  reorderThreshold?: number;
  minimumStock?: number;
  storageLocation?: string;
  supplierName?: string;
  description?: string;
}

export interface EquipmentResponse {
  id: string;
  assetCode: string;
  equipmentCode?: string;
  name: string;
  model?: string;
  serialNumber?: string;
  licensePlate?: string;
  status: EquipmentStatus;
  currentProjectId?: string;
  currentProjectName?: string;
  hourlyRate?: number;
  dailyRate?: number;
  currency?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
}

export interface CreateEquipmentRequest {
  assetCode?: string;
  equipmentCode?: string;
  name: string;
  model?: string;
  serialNumber?: string;
  licensePlate?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  hourlyRate?: number;
  dailyRate?: number;
  currency?: string;
  nextMaintenanceDate?: string;
}

export interface UpdateEquipmentRequest {
  name: string;
  model?: string;
  serialNumber?: string;
  status: EquipmentStatus;
  hourlyRate?: number;
  dailyRate?: number;
  nextMaintenanceDate?: string;
}

export interface AssignEquipmentRequest {
  projectId: string;
  assignedToUserId?: string;
  deployedDate: string;
  estimatedReturnDate?: string;
  notes?: string;
}

export interface ReturnEquipmentRequest {
  returnDate: string;
  conditionOnReturn?: string;
  notes?: string;
}

export interface InventoryMovementResponse {
  id: string;
  materialId: string;
  materialName?: string;
  projectId?: string;
  projectName?: string;
  movementType: MovementType;
  quantity: number;
  movementDate: string;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface RecordMovementRequest {
  materialId: string;
  projectId?: string;
  movementType?: MovementType;
  type?: MovementType;
  quantity: number;
  unitCost?: number;
  movementDate: string;
  referenceNumber?: string;
  notes?: string;
}

// ==========================================
// DOCUMENTS
// ==========================================

export interface DocumentResponse {
  id: string;
  documentCode: string;
  projectId?: string;
  projectName?: string;
  title: string;
  documentType: DocumentType;
  type?: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  fileSize?: number;
  mimeType: string;
  revision?: string;
  description?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateDocumentRequest {
  projectId?: string;
  title: string;
  documentType?: DocumentType;
  type?: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSizeBytes?: number;
  fileSize?: number;
  mimeType: string;
  revision?: string;
  description?: string;
  notes?: string;
}

export interface UpdateDocumentRequest {
  title: string;
  documentType: DocumentType;
  description?: string;
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export interface NotificationResponse {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  channel: string;
  priority: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

// ==========================================
// COMPANY PROFILE
// ==========================================

export interface CompanyProfileResponse {
  id: string;
  companyNameEn: string;
  companyNameKm: string;
  registrationNumber?: string;
  vatTin?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
  defaultCurrency?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankSwiftCode?: string;
  logoUrl?: string;
}

export interface CompanyProfileRequest {
  companyNameEn: string;
  companyNameKm: string;
  registrationNumber?: string;
  vatTin?: string;
  email?: string;
  phone?: string;
  website?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
  defaultCurrency?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankSwiftCode?: string;
  logoUrl?: string;
}

// ==========================================
// AUDIT LOGS
// ==========================================

export interface AuditLogResponse {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entityName: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}
