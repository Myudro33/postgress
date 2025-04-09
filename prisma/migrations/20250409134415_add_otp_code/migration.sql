-- AlterTable
CREATE SEQUENCE users_roleid_seq;
ALTER TABLE "users" ADD COLUMN     "otpCode" VARCHAR(6),
ADD COLUMN     "otpExpiry" TIMESTAMP(6),
ALTER COLUMN "roleId" SET DEFAULT nextval('users_roleid_seq');
ALTER SEQUENCE users_roleid_seq OWNED BY "users"."roleId";
