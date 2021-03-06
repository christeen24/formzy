# Migration `20200909125503-add-admin`

This migration has been generated by Tim Raderschad at 9/9/2020, 2:55:03 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Form" (
"id" SERIAL,
"name" text   NOT NULL ,
"callbackUrl" text   ,
"hasCustomCallback" boolean   NOT NULL DEFAULT false,
"adminId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Submission" (
"id" SERIAL,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"content" jsonb   NOT NULL ,
"formId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."User" (
"id" SERIAL,
"email" text   NOT NULL ,
"name" text   ,
"hashedPassword" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."_FormToUser" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL 
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

CREATE UNIQUE INDEX "_FormToUser_AB_unique" ON "public"."_FormToUser"("A", "B")

CREATE INDEX "_FormToUser_B_index" ON "public"."_FormToUser"("B")

ALTER TABLE "public"."Submission" ADD FOREIGN KEY ("formId")REFERENCES "public"."Form"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_FormToUser" ADD FOREIGN KEY ("A")REFERENCES "public"."Form"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_FormToUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200909122209-add-custom-callback..20200909125503-add-admin
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -13,8 +13,9 @@
   users             User[]
   submissions       Submission[]
   callbackUrl       String?
   hasCustomCallback Boolean @default(false)
+  adminId           Int
 }
 model Submission {
   id        Int      @default(autoincrement()) @id
```


