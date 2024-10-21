-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Movie', 'Show');

-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('Watched', 'ToWatch');

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "listType" "ListType" NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListEntry" (
    "id" SERIAL NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "posterUrl" TEXT NOT NULL,
    "listId" INTEGER NOT NULL,

    CONSTRAINT "ListEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
