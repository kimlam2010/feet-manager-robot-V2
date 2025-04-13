-- CreateEnum
CREATE TYPE "RobotStatus" AS ENUM ('ONLINE', 'OFFLINE', 'BUSY', 'ERROR', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('GOOD', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "WorksetStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SCHEDULED', 'COMPLETED', 'FAILED');

-- DropIndex
DROP INDEX "AuditLog_action_idx";

-- DropIndex
DROP INDEX "AuditLog_resource_idx";

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "robotId" TEXT,
ADD COLUMN     "worksetId" TEXT;

-- CreateTable
CREATE TABLE "Robot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "status" "RobotStatus" NOT NULL DEFAULT 'OFFLINE',
    "batteryLevel" INTEGER NOT NULL DEFAULT 100,
    "location" TEXT,
    "firmware" TEXT NOT NULL,
    "lastActive" TIMESTAMP(3),
    "configuration" JSONB,
    "healthStatus" "HealthStatus" NOT NULL DEFAULT 'GOOD',
    "worksetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Robot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "WorksetStatus" NOT NULL DEFAULT 'INACTIVE',
    "schedule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Robot_serialNumber_key" ON "Robot"("serialNumber");

-- CreateIndex
CREATE INDEX "Robot_worksetId_idx" ON "Robot"("worksetId");

-- CreateIndex
CREATE INDEX "AuditLog_robotId_idx" ON "AuditLog"("robotId");

-- CreateIndex
CREATE INDEX "AuditLog_worksetId_idx" ON "AuditLog"("worksetId");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_robotId_fkey" FOREIGN KEY ("robotId") REFERENCES "Robot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_worksetId_fkey" FOREIGN KEY ("worksetId") REFERENCES "Workset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Robot" ADD CONSTRAINT "Robot_worksetId_fkey" FOREIGN KEY ("worksetId") REFERENCES "Workset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
