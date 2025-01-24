-- CreateTable
CREATE TABLE "Website" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "websiteURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);
