# BJJ Tournament

An application to register Brazilian Jiu-Jitsu Athletes to a tournament and list them based on categories

## How to run
- Git clone this repo
- use npm i
- Configure .env following the .env.example
- Restore the database using dump.sql file
- Use npm run dev for running with live file editing
- Use npm run build for running the compiled JavaScript files

## How to use
Restoring the dump database will already provide the belt colors ID used on Jiu-Jitsu for graduation. Considering this, in the entire application this equivalence is used:

- White Belt: 1

- Blue Belt: 2

- Purple Belt: 3

- Brown Belt: 4

- Black Belt: 5

The application provides the following routes:

### GET /athletes
Returns all athletes registered on database

### POST /athletes
Registers a new athlete sending the json BODY format: 

{
   name: (string),
   age: (number),
   weight: (number),
   belt: (number 1-5),
   team: (string)
}

### PUT /athletes/:id
Edit an athlete registration sending athlete ID on url params and json BODY in the same format as POST

### DELETE /athletes/:id
Delete an athlete from the registers based on ID sent on url params

### GET /tournament/:belt/:age/:weight
Generate a tournament category athletes list based on Belt color graduation, weight class and age range. 

EXAMPLE: "GET - /tournament/5/adult/heavy" (returns athletes with black belt, between 18 and 29 years old that weight 89 to 100 kgs

The following categories apply:

WEIGHT CLASSES (kgs)
- feather: 60 to 70
- light: 71 to 75
- medium: 76 to 82
- mid-heavy: 83 to 88
- heavy: 89 to 100
- super-heavy: 101+

AGE CLASSES (years old)
- junior: 12 to 17
- adult: 18 to 29
- master: 30+

### GET /tournament/:belt/absolute
Generates the Absolute catergoy tournament, that does not consider any weight or age classes, only filtering athletes by BELT color graduation


