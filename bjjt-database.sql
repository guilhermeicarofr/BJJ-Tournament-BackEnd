CREATE TABLE "athleteInfo" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"cpf" varchar(255) NOT NULL UNIQUE,
	"male" BOOLEAN NOT NULL,
	"belt" integer NOT NULL,
	"weight" integer NOT NULL,
	"age" integer NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"deletedAt" TIMESTAMP DEFAULT NULL,
	CONSTRAINT "athleteInfo_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id" serial NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"deletedAt" TIMESTAMP DEFAULT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "event" (
	"id" serial NOT NULL,
	"createdBy" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"date" DATE NOT NULL,
	"price" integer NOT NULL,
	"absolute" BOOLEAN NOT NULL,
	"description" TEXT NOT NULL,
	"open" BOOLEAN NOT NULL DEFAULT 'true',
	"finished" BOOLEAN NOT NULL DEFAULT 'false',
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"deletedAt" TIMESTAMP DEFAULT NULL,
	CONSTRAINT "event_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "categories" (
	"id" serial NOT NULL,
	"eventId" integer NOT NULL,
	"absolute" BOOLEAN NOT NULL,
	"male" BOOLEAN NOT NULL,
	"belt" integer NOT NULL,
	"weightClass" integer NOT NULL,
	"ageClass" integer NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"deletedAt" TIMESTAMP DEFAULT NULL,	
	CONSTRAINT "categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "fights" (
	"id" serial NOT NULL,
	"categoriesId" integer NOT NULL,
	"athlete1" integer NOT NULL,
	"athlete2" integer NOT NULL,
	"winner" integer NOT NULL,
	"previousFight1" integer,
	"previousFight2" integer,
	"final" BOOLEAN NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"deletedAt" TIMESTAMP DEFAULT NULL,	
	CONSTRAINT "fights_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "registrations" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"deletedAt" TIMESTAMP DEFAULT NULL,
	CONSTRAINT "registrations_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "athleteInfo" ADD CONSTRAINT "athleteInfo_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");


ALTER TABLE "event" ADD CONSTRAINT "event_fk0" FOREIGN KEY ("createdBy") REFERENCES "users"("id");

ALTER TABLE "categories" ADD CONSTRAINT "categories_fk0" FOREIGN KEY ("eventId") REFERENCES "event"("id");

ALTER TABLE "fights" ADD CONSTRAINT "fights_fk0" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id");
ALTER TABLE "fights" ADD CONSTRAINT "fights_fk1" FOREIGN KEY ("athlete1") REFERENCES "users"("id");
ALTER TABLE "fights" ADD CONSTRAINT "fights_fk2" FOREIGN KEY ("athlete2") REFERENCES "users"("id");
ALTER TABLE "fights" ADD CONSTRAINT "fights_fk3" FOREIGN KEY ("winner") REFERENCES "users"("id");
ALTER TABLE "fights" ADD CONSTRAINT "fights_fk4" FOREIGN KEY ("previousFight1") REFERENCES "fights"("id");
ALTER TABLE "fights" ADD CONSTRAINT "fights_fk5" FOREIGN KEY ("previousFight2") REFERENCES "fights"("id");

ALTER TABLE "registrations" ADD CONSTRAINT "registrations_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_fk1" FOREIGN KEY ("categoryId") REFERENCES "categories"("id");
