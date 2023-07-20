# Install (mac)

- Install node (v)
- Install brew (`https://brew.sh/index_fr`)
  - add `/opt/homebrew/bin` in your path (mainly to (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc).)
- Install yarn `brew install yarn`
- Install nvm `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
- Install docker

# Please 

- Send a mail / message as soon as the project has been corrected. Heroku subscription is not 100% free.


# Initialize project Run project

- Start DB container using `docker-compose -f backend/docker-compose.yml up`
- Setup the environment variables locally `yarn run init:env` ( mandatory to target DB )

# Run the project

## backend

- Start DB container using `docker-compose -f backend/docker-compose.yml up`
- Init your DB `npx prisma migrate dev`
- Seed your DB with `npx prisma db seed` first time, or `npx prisma migration reset` il you want to reseed
- Run backend  `yarn serve:back`
- You can now target localhost:3000

## frontend

- Run frontend `yarn serve:front`
- You can now target localhost:4200
- Deployed on [HEROKU](https://studifront-b28697fd877e.herokuapp.com/)

## credentials

- admin@studigarage.io -- P@ssword1
- employee1@studigarage.io -- P@ssword2
- If you want to reset admin password, `yarn run generate:pwd <mypassword>`. Then, inside docker container, you can update it directly with psql command.

### Run Linter

- Full project linting run on pre-commit hook thanks to Husky.
- You can manually lint with `yarn workspace <studifront|studiback> lint` or by running commands in the corresponding project directory

```bash
# unit tests
$ yarn run lint
```

# Deploy

```bash
# deploy backend
$ git push heroku-studigarage main

# deploy frontend
$ git push heroku-studifront main
```