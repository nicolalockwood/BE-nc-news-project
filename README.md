# Northcoders News API

This API serves JSON data for a news website, consisting of articles, comments, topics, and users info. It then uses these to create multiple end points each with a specific use, detailed in get/API.

https://nicola-nc-news.herokuapp.com/api

Please start by cloning this repo.

- Fork repo, and copy code URL.
- In VS code run command 'git clone url'

# ----Set up infomation----

- Run `NPM install`. This will download dependencies from package.JSON.

-Run `NPM setup-dbs`. This will initialise the data base ready to be populated

-Run `NPM seed`. This will seed the newly set up database with values and data.

-Run `NPM test`. This is will enable testing suite to run.

# ----Dependencies used----

These will be insatlled from package.JSON, but are here in list form for reference:

-postgres
-husky
-express
-jest
-jest-extended
-jest-sorted
-pg-format
-supertest
-dotenv
-fs

# ----Minimum Versions ----

Please run with a minimum of the following version types:

npm: '8.3.1',
node: '16.14.0',
v8: '9.4.146.24-node.20',
pg: '^8.7.3'

# ----ENV----

Please create enviroment variables to be able to clone and locally run this file succesfully. Please create the following files and double check they are succesfully in git ignore:

- `.env.test` - In the body of this file please add PGDATABASE=nc_news_test -`.env.development` - In the body of this file please add PGDATABASE=nc_news
