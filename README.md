# Northcoders News API

This is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture. It accesses different databases (articles, comments, topics, and users) and uses these to create multiple end points each with a specific use, detailed in get/API.

_Inserted hosted link_

Please start by cloning this repo.

- Fork repo, and copy code URL.
- In VS code run command 'git clone url'

Then install dependencies.

- Run NPM init followed by NPM install. This will download dependencies from package.JSON.
  Required items are:
  -postgres
  -husky
  -express
  -jest
  -jest-extended
  -jest-sorted
  pg-format
  supertest
  dotenv
  pg

----ENV----
Please create enviroment variables to be able to clone and locally run this file succesfully. Please create the following files:

- .env.test - In the body of this file please add PGDATABASE=nc_news_test
  -.env.development - In the body of this file please add PGDATABASE=nc_news
