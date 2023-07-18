# Install (mac)

- Install node (v)
- Install brew (`https://brew.sh/index_fr`)
  - add `/opt/homebrew/bin` in your path (mainly to (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc).)
- Install yarn `brew install yarn`
- Install nvm `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash`
- Install docker


# Initialize project Run project

- Start DB container using `docker-compose -f backend/docker-compose.yml up`
- Setup the environment variables locally `yarn run init:env` ( mandatory to target DB )

# Run the project

## backend

- Start DB container using `docker-compose -f backend/docker-compose.yml up`
- Run backend  `yarn serve:back`
- You can now target localhost:3000

## frontend

- Run frontend `yarn serve:front`
- You can now target localhost:4200

## credentials

- admin@studigarage.io -- P@ssword1
- employee1@studigarage.io -- P@ssword2

### Run tests

- Be sure that containers are started.

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# Deploy

```bash
# deploy backend
$ git push heroku-studigarage

# deploy frontend
$ git push heroku-studifront
```