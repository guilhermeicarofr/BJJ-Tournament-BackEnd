CREATE TABLE "athletes" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"weight" integer NOT NULL,
	"age" integer NOT NULL,
	"team" TEXT NOT NULL,
	"belt_id" integer NOT NULL,
	CONSTRAINT "athletes_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "belts" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "belts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "athletes" ADD CONSTRAINT "athletes_fk0" FOREIGN KEY ("belt_id") REFERENCES "belts"("id");