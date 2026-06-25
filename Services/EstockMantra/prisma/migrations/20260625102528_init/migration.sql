-- CreateEnum
CREATE TYPE "IndentStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'QC_PENDING', 'CLOSED');

-- CreateEnum
CREATE TYPE "QCStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'STOCK_ADDED', 'CLOSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'password',
    "providerId" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyOwner" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "photoURL" TEXT,
    "settings" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "resetPasswordExpires" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "lastActiveAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "allowedAdmins" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowedUsers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "totalInStock" INTEGER NOT NULL DEFAULT 0,
    "totalIssued" INTEGER NOT NULL DEFAULT 0,
    "totalClosedStock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "totalInStock" INTEGER NOT NULL DEFAULT 0,
    "totalIssued" INTEGER NOT NULL DEFAULT 0,
    "totalClosedStock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "mainCategory" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT,
    "description" TEXT,
    "package" TEXT,
    "specification" TEXT,
    "mfgPartNo" TEXT,
    "vendorPartNo" TEXT,
    "storageLocation" TEXT,
    "unitPrice" DOUBLE PRECISION,
    "supplier" TEXT,
    "link" TEXT,
    "invoiceNo" TEXT,
    "quantityReceived" INTEGER NOT NULL DEFAULT 0,
    "openingStock" INTEGER NOT NULL DEFAULT 0,
    "issued" INTEGER NOT NULL DEFAULT 0,
    "closedStock" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "threshold" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "highlightColor" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialIssued" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantityIssued" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "receivedBy" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isReturnable" BOOLEAN NOT NULL DEFAULT false,
    "returnDate" TIMESTAMP(3),
    "returnedBy" TEXT,
    "returnReceivedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "quantityReturned" INTEGER,
    "remarks" TEXT,
    "returnRemarks" TEXT,

    CONSTRAINT "MaterialIssued_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetUrl" TEXT,
    "projectId" TEXT,
    "itemId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "targetId" TEXT,
    "targetType" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "itemId" TEXT,
    "previousValue" TEXT,
    "projectId" TEXT,
    "quantityChange" INTEGER,
    "updatedValue" TEXT,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockHistory" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "changeType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "batchSize" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleItem" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "mfgPartNo" TEXT NOT NULL,
    "vendorPartNo" TEXT NOT NULL,
    "quantityPerPcb" INTEGER NOT NULL,
    "quantityForX" INTEGER NOT NULL,
    "mappedItemId" TEXT,
    "mainCategory" TEXT,
    "name" TEXT,
    "package" TEXT,
    "specification" TEXT,
    "subCategory" TEXT,

    CONSTRAINT "ModuleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleIssue" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "moduleItemId" TEXT NOT NULL,
    "quantityIssued" INTEGER NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedTo" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "receivedBy" TEXT NOT NULL,
    "isReturnable" BOOLEAN NOT NULL DEFAULT false,
    "returnDate" TIMESTAMP(3),
    "returnedBy" TEXT,
    "returnReceivedBy" TEXT,
    "remarks" TEXT,
    "mappedItemId" TEXT,
    "quantityReturned" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mainCategory" TEXT,
    "package" TEXT,
    "specification" TEXT,
    "subCategory" TEXT,

    CONSTRAINT "ModuleIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indent" (
    "id" TEXT NOT NULL,
    "indentNumber" TEXT,
    "indentorId" TEXT NOT NULL,
    "approverId" TEXT,
    "status" "IndentStatus" NOT NULL DEFAULT 'DRAFT',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,
    "workspaceId" TEXT,

    CONSTRAINT "Indent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndentItem" (
    "id" TEXT NOT NULL,
    "indentId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "description" TEXT,
    "purpose" TEXT[],
    "vendor" TEXT[],
    "purchaseMode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "approved" BOOLEAN,
    "remark" TEXT,

    CONSTRAINT "IndentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QCCard" (
    "id" TEXT NOT NULL,
    "indentId" TEXT,
    "materialName" TEXT NOT NULL,
    "materialCode" TEXT,
    "vendor" TEXT,
    "project" TEXT NOT NULL,
    "lotNumber" TEXT,
    "receivedDate" TIMESTAMP(3),
    "qcDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qtyOrdered" INTEGER NOT NULL,
    "qtyReceived" INTEGER NOT NULL DEFAULT 0,
    "criticalInspection" BOOLEAN NOT NULL DEFAULT false,
    "qtyInspected" INTEGER NOT NULL DEFAULT 0,
    "qtyAccepted" INTEGER NOT NULL DEFAULT 0,
    "qtyRejected" INTEGER NOT NULL DEFAULT 0,
    "rejectionReason" TEXT,
    "rejectionDetails" TEXT,
    "inspectionDetails" TEXT,
    "remarks" TEXT,
    "status" "QCStatus" NOT NULL DEFAULT 'DRAFT',
    "preparedById" TEXT NOT NULL,
    "approverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workspaceId" TEXT,

    CONSTRAINT "QCCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionParameter" (
    "id" TEXT NOT NULL,
    "qcCardId" TEXT NOT NULL,
    "parameter" TEXT NOT NULL,
    "specification" TEXT NOT NULL,
    "actualValue" TEXT,
    "result" TEXT,

    CONSTRAINT "InspectionParameter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetPasswordToken_key" ON "users"("resetPasswordToken");

-- CreateIndex
CREATE INDEX "SubCategory_projectId_idx" ON "SubCategory"("projectId");

-- CreateIndex
CREATE INDEX "Item_projectId_idx" ON "Item"("projectId");

-- CreateIndex
CREATE INDEX "Item_subCategoryId_idx" ON "Item"("subCategoryId");

-- CreateIndex
CREATE INDEX "Item_closedStock_idx" ON "Item"("closedStock");

-- CreateIndex
CREATE INDEX "Item_deleted_idx" ON "Item"("deleted");

-- CreateIndex
CREATE INDEX "MaterialIssued_itemId_idx" ON "MaterialIssued"("itemId");

-- CreateIndex
CREATE INDEX "MaterialIssued_projectId_idx" ON "MaterialIssued"("projectId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_itemId_idx" ON "Notification"("itemId");

-- CreateIndex
CREATE INDEX "Workspace_ownerId_idx" ON "Workspace"("ownerId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_idx" ON "WorkspaceMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "Indent_workspaceId_idx" ON "Indent"("workspaceId");

-- CreateIndex
CREATE INDEX "QCCard_workspaceId_idx" ON "QCCard"("workspaceId");

-- CreateIndex
CREATE INDEX "InspectionParameter_qcCardId_idx" ON "InspectionParameter"("qcCardId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialIssued" ADD CONSTRAINT "MaterialIssued_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialIssued" ADD CONSTRAINT "MaterialIssued_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialIssued" ADD CONSTRAINT "MaterialIssued_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleItem" ADD CONSTRAINT "ModuleItem_mappedItemId_fkey" FOREIGN KEY ("mappedItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleItem" ADD CONSTRAINT "ModuleItem_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleIssue" ADD CONSTRAINT "ModuleIssue_mappedItemId_fkey" FOREIGN KEY ("mappedItemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleIssue" ADD CONSTRAINT "ModuleIssue_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleIssue" ADD CONSTRAINT "ModuleIssue_moduleItemId_fkey" FOREIGN KEY ("moduleItemId") REFERENCES "ModuleItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indent" ADD CONSTRAINT "Indent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indent" ADD CONSTRAINT "Indent_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indent" ADD CONSTRAINT "Indent_indentorId_fkey" FOREIGN KEY ("indentorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indent" ADD CONSTRAINT "Indent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndentItem" ADD CONSTRAINT "IndentItem_indentId_fkey" FOREIGN KEY ("indentId") REFERENCES "Indent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCCard" ADD CONSTRAINT "QCCard_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCCard" ADD CONSTRAINT "QCCard_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCCard" ADD CONSTRAINT "QCCard_indentId_fkey" FOREIGN KEY ("indentId") REFERENCES "Indent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCCard" ADD CONSTRAINT "QCCard_preparedById_fkey" FOREIGN KEY ("preparedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InspectionParameter" ADD CONSTRAINT "InspectionParameter_qcCardId_fkey" FOREIGN KEY ("qcCardId") REFERENCES "QCCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
