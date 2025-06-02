# Movie API & React Frontend

## Overview
This project provides a RESTful API for querying movie data from SQLite databases and a modern React frontend for browsing, searching, and viewing movie details. The backend is built with Node.js/Express, and the frontend is in React (Create React App).

## Pre-requisites
* Node.js (v16+ recommended)
* npm (comes with Node.js)
* [Sqlite3](http://www.sqlitetutorial.net/)

## Project Structure
```
Movies/
├── controllers/         # Backend controllers
├── routes/              # Backend routes
├── db/                  # SQLite database files
├── client/              # React frontend (Create React App)
├── index.js             # Backend entry point
├── package.json         # Backend dependencies
├── README.md            # This file
└── ...
```

## Setup & Usage

### 1. Install Backend Dependencies
```
npm install
```

### 2. Install Frontend Dependencies
```
cd client
npm install
```

### 3. Start the Backend Server
```
# From the project root
node index.js
# or
npm start
```
The backend will run on [http://localhost:3000](http://localhost:3000).

### 4. Start the React Frontend
```
cd client
npm start
```
The frontend will run on [http://localhost:3000](http://localhost:3000) (proxying API requests to the backend).

## Features
- Paginated movie list (50 per page)
- Search movies by title
- Filter movies by genre
- View movie details in a modal (with human-readable genres and production companies)
- Responsive, modern UI
- US-style date formatting (MM-DD-YYYY)

## API Endpoints
- `GET /movies?page=1` — List all movies (paginated)
- `GET /movies?search=title` — Search movies by title
- `GET /movies/genre/:genre?page=1` — List movies by genre
- `GET /movies/year/:year?page=1` — List movies by year
- `GET /movies/:imdbId` — Get movie details

## Development Notes
- The backend uses SQLite databases in the `db/` folder. No credentials are required.
- The React frontend is in the `client/` folder and uses a proxy to avoid CORS issues during development.
- To build the frontend for production, run `npm run build` in the `client` directory.

## .gitignore
- The root `.gitignore` and `client/.gitignore` are set up to ignore `node_modules`, build artifacts, environment files, logs, and OS-specific files.

## Contact
If you have questions or want to add more features, feel free to ask!

## Task
Your task is to create an API on top of a couple different databases.  It should conform to the user stories provided below.  You are free to use whatever language you prefer, however our tech stack features NodeJS, Java and Ruby. If you're comfortable with any of these, try to favor them.  Google and the interwebs are at your disposal.

**The Databases**
The databases are provided as a SQLite3 database in `db/`.  It does not require any credentials to login.  You can run SQL queries directly against the database using:

```
sqlite <path to db file>
```

`.tables` will return a list of available tables and `.schema <table>` will provide the schema.

## Considerations
When developing your solution, please consider the following:

* Structure of your endpoints - Can you easily extend the API to support new endpoints as feature requests come in?
* Quality of your code - Does your code demonstrate the use of design patterns?
* Testability - Is your code testable?
* Can your solution be easily configured and deployed?  Consider guidelines from [12 Factor App](http://12factor.net/)


## User Stories

#### List All Movies
AC:

* An endpoint exists that lists all movies
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* Columns should include: imdb id, title, genres, release date, budget
* Budget is displayed in dollars

#### Movie Details
AC:

* An endpoint exists that lists the movie details for a particular movie
* Details should include: imdb id, title, description, release date, budget, runtime, average rating, genres, original language, production companies
* Budget should be displayed in dollars
* Ratings are pulled from the rating database

#### Movies By Year
AC:

* An endpoint exists that will list all movies from a particular year 
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* List is sorted by date in chronological order
* Sort order can be descending
* Columns include: imdb id, title, genres, release date, budget

#### Movies By Genre
AC:

* An endpoint exists that will list all movies by a genre
* List is paginated: 50 movies per page, the page can be altered with the `page` query params
* Columns include: imdb id, title, genres, release date, budget
