-- CreateEnum
CREATE TYPE "FileRole" AS ENUM ('SermonAudioFile');

-- CreateTable
CREATE TABLE "DatabaseMetadata" (
    "id" SERIAL NOT NULL,
    "version" INTEGER NOT NULL,
    "isDevData" BOOLEAN,

    CONSTRAINT "DatabaseMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "uploadDateTime" TIMESTAMP(3) NOT NULL,
    "role" "FileRole",

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" SERIAL NOT NULL,
    "errorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "cause" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "internalError" JSONB,

    CONSTRAINT "ErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseLog" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "errorLogEntryId" INTEGER,
    "data" BYTEA,
    "dataSize" INTEGER,
    "statusText" TEXT,

    CONSTRAINT "ResponseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" SERIAL NOT NULL,
    "publicationDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sermon" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "audioFileId" UUID NOT NULL,
    "seriesId" INTEGER,
    "speakerId" INTEGER NOT NULL,

    CONSTRAINT "Sermon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SermonSpeaker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,

    CONSTRAINT "SermonSpeaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SermonSeries" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "SermonSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "AdminFlag" BOOLEAN NOT NULL DEFAULT false,
    "ManageCalendarFlag" BOOLEAN NOT NULL DEFAULT false,
    "ManageNewsFlag" BOOLEAN NOT NULL DEFAULT false,
    "ManageSermonsFlag" BOOLEAN NOT NULL DEFAULT false,
    "ManageRoomsFlag" BOOLEAN NOT NULL DEFAULT false,
    "ManageUserFlag" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseMetadata_id_key" ON "DatabaseMetadata"("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_fileId_key" ON "File"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "ErrorLog_id_key" ON "ErrorLog"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ErrorLog_errorId_key" ON "ErrorLog"("errorId");

-- CreateIndex
CREATE UNIQUE INDEX "ResponseLog_id_key" ON "ResponseLog"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NewsPost_id_key" ON "NewsPost"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Sermon_id_key" ON "Sermon"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SermonSpeaker_id_key" ON "SermonSpeaker"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SermonSpeaker_name_key" ON "SermonSpeaker"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SermonSpeaker_initials_key" ON "SermonSpeaker"("initials");

-- CreateIndex
CREATE UNIQUE INDEX "SermonSeries_id_key" ON "SermonSeries"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "ResponseLog" ADD CONSTRAINT "ResponseLog_errorLogEntryId_fkey" FOREIGN KEY ("errorLogEntryId") REFERENCES "ErrorLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sermon" ADD CONSTRAINT "Sermon_audioFileId_fkey" FOREIGN KEY ("audioFileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sermon" ADD CONSTRAINT "Sermon_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "SermonSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sermon" ADD CONSTRAINT "Sermon_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "SermonSpeaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
