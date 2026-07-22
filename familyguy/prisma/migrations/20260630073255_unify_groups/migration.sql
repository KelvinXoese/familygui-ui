/*
  Warnings:

  - You are about to drop the column `familyId` on the `announcements` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `archive_documents` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `dues` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `family_tree_children` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `family_tree_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the `families` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `family_members` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,groupId]` on the table `family_tree_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `announcements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `archive_documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `dues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `family_tree_children` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `family_tree_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('FAMILY', 'GROUP', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "PostReactionType" AS ENUM ('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'WEDDING';
ALTER TYPE "EventType" ADD VALUE 'NAMING_CEREMONY';
ALTER TYPE "EventType" ADD VALUE 'MEETING';
ALTER TYPE "EventType" ADD VALUE 'CONFERENCE';
ALTER TYPE "EventType" ADD VALUE 'PARTY';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'MEMBER_JOINED';
ALTER TYPE "NotificationType" ADD VALUE 'MEMBER_REMOVED';

-- DropForeignKey
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_familyId_fkey";

-- DropForeignKey
ALTER TABLE "archive_documents" DROP CONSTRAINT "archive_documents_familyId_fkey";

-- DropForeignKey
ALTER TABLE "dues" DROP CONSTRAINT "dues_familyId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_familyId_fkey";

-- DropForeignKey
ALTER TABLE "families" DROP CONSTRAINT "families_createdById_fkey";

-- DropForeignKey
ALTER TABLE "family_members" DROP CONSTRAINT "family_members_familyId_fkey";

-- DropForeignKey
ALTER TABLE "family_members" DROP CONSTRAINT "family_members_invitedById_fkey";

-- DropForeignKey
ALTER TABLE "family_members" DROP CONSTRAINT "family_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "family_tree_children" DROP CONSTRAINT "family_tree_children_familyId_fkey";

-- DropForeignKey
ALTER TABLE "family_tree_profiles" DROP CONSTRAINT "family_tree_profiles_familyId_fkey";

-- DropForeignKey
ALTER TABLE "meetings" DROP CONSTRAINT "meetings_familyId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_familyId_fkey";

-- DropIndex
DROP INDEX "announcements_familyId_idx";

-- DropIndex
DROP INDEX "archive_documents_familyId_idx";

-- DropIndex
DROP INDEX "dues_familyId_idx";

-- DropIndex
DROP INDEX "events_familyId_idx";

-- DropIndex
DROP INDEX "family_tree_children_familyId_idx";

-- DropIndex
DROP INDEX "family_tree_profiles_familyId_idx";

-- DropIndex
DROP INDEX "family_tree_profiles_userId_familyId_key";

-- DropIndex
DROP INDEX "meetings_familyId_idx";

-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "familyId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "archive_documents" DROP COLUMN "familyId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "dues" DROP COLUMN "familyId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "familyId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "family_tree_children" DROP COLUMN "familyId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "family_tree_profiles" DROP COLUMN "familyId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "meetings" DROP COLUMN "familyId",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "familyId",
ADD COLUMN     "groupId" TEXT;

-- DropTable
DROP TABLE "families";

-- DropTable
DROP TABLE "family_members";

-- DropEnum
DROP TYPE "FamilyMemberRole";

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "type" "GroupType" NOT NULL DEFAULT 'FAMILY',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "motto" TEXT,
    "origin" TEXT,
    "coverPhotoUrl" TEXT,
    "avatarUrl" TEXT,
    "inviteCode" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedById" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hierarchy_nodes" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hierarchy_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "caption" TEXT,
    "imageUrl" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_reactions" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PostReactionType" NOT NULL DEFAULT 'LIKE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_replies" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_inviteCode_key" ON "groups"("inviteCode");

-- CreateIndex
CREATE INDEX "groups_inviteCode_idx" ON "groups"("inviteCode");

-- CreateIndex
CREATE INDEX "groups_type_idx" ON "groups"("type");

-- CreateIndex
CREATE INDEX "group_members_groupId_idx" ON "group_members"("groupId");

-- CreateIndex
CREATE INDEX "group_members_userId_idx" ON "group_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_groupId_userId_key" ON "group_members"("groupId", "userId");

-- CreateIndex
CREATE INDEX "hierarchy_nodes_groupId_idx" ON "hierarchy_nodes"("groupId");

-- CreateIndex
CREATE INDEX "posts_groupId_idx" ON "posts"("groupId");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");

-- CreateIndex
CREATE INDEX "post_reactions_postId_idx" ON "post_reactions"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "post_reactions_postId_userId_key" ON "post_reactions"("postId", "userId");

-- CreateIndex
CREATE INDEX "post_comments_postId_idx" ON "post_comments"("postId");

-- CreateIndex
CREATE INDEX "comment_replies_commentId_idx" ON "comment_replies"("commentId");

-- CreateIndex
CREATE INDEX "announcements_groupId_idx" ON "announcements"("groupId");

-- CreateIndex
CREATE INDEX "archive_documents_groupId_idx" ON "archive_documents"("groupId");

-- CreateIndex
CREATE INDEX "dues_groupId_idx" ON "dues"("groupId");

-- CreateIndex
CREATE INDEX "events_groupId_idx" ON "events"("groupId");

-- CreateIndex
CREATE INDEX "family_tree_children_groupId_idx" ON "family_tree_children"("groupId");

-- CreateIndex
CREATE INDEX "family_tree_profiles_groupId_idx" ON "family_tree_profiles"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "family_tree_profiles_userId_groupId_key" ON "family_tree_profiles"("userId", "groupId");

-- CreateIndex
CREATE INDEX "meetings_groupId_idx" ON "meetings"("groupId");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hierarchy_nodes" ADD CONSTRAINT "hierarchy_nodes_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hierarchy_nodes" ADD CONSTRAINT "hierarchy_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "hierarchy_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_tree_profiles" ADD CONSTRAINT "family_tree_profiles_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_tree_children" ADD CONSTRAINT "family_tree_children_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_replies" ADD CONSTRAINT "comment_replies_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "post_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_replies" ADD CONSTRAINT "comment_replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dues" ADD CONSTRAINT "dues_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_documents" ADD CONSTRAINT "archive_documents_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
