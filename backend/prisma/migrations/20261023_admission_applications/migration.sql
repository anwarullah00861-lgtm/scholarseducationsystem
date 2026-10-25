-- Phase 3: Admission applications table.
-- Adds the AdmissionApplication model with all fields for the online admission form.

CREATE TYPE "AdmissionStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WAITLISTED');

CREATE TYPE "AdmissionClass" AS ENUM ('PG', 'NURSERY', 'PREP', 'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 'GRADE_7', 'GRADE_8');

CREATE TYPE "AdmissionGender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

CREATE TYPE "AdmissionTemplate" AS ENUM ('NEW', 'RE_ADMISSION', 'SIBLING', 'TRANSFER');

CREATE TABLE "AdmissionApplication" (
    "id" UUID NOT NULL,
    "template" "AdmissionTemplate" NOT NULL,
    "appliedClass" "AdmissionClass" NOT NULL,
    "studentFullName" TEXT NOT NULL,
    "fatherFullName" TEXT NOT NULL,
    "fatherCNIC" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMPTZ NOT NULL,
    "dateOfBirthInWords" TEXT NOT NULL,
    "gender" "AdmissionGender" NOT NULL,
    "fatherOccupation" TEXT NOT NULL,
    "domicile" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "residentialAddress" TEXT NOT NULL,
    "primaryContact" TEXT NOT NULL,
    "alternateContact" TEXT,
    "previousClass" TEXT,
    "previousSchoolName" TEXT,
    "leavingDate" TIMESTAMPTZ,
    "photoUrl" TEXT NOT NULL,
    "cnicCopyUrl" TEXT,
    "domicileCopyUrl" TEXT,
    "schoolLeavingCertUrl" TEXT,
    "status" "AdmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "AdmissionApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdmissionApplication_status_idx" ON "AdmissionApplication"("status");
CREATE INDEX "AdmissionApplication_createdAt_idx" ON "AdmissionApplication"("createdAt");
CREATE INDEX "AdmissionApplication_appliedClass_idx" ON "AdmissionApplication"("appliedClass");
