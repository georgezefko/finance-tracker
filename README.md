# Built an App for tracking personal finances using NodeJS, ExpressJS, PostgreSQL, ReactJS, Typescript

## Motivation
I have always kept track of my finances using excel spreadsheets and throughtout the years became hard to keep good record of all my expenses and investments.
Although there are plenty of apps out there this was a good chance for me to practise my skills on building an end-to-end application.

**NOTE** 

This is still an in progress side project of mine. 

## App Structure

The application consists of the 3 components

- Backend: NodeJS, ExpressJS, Typescript
- Database: PostgreSQL
- Frontend: ReactJS, Typescript

Backend and Frontend communicate via a basic `RestAPI`

All the components are containerized in `Docker` containers.

To run the project you first need to clone the repo
```
git clone {repo}
```

Then to buld the images and start the containers you run

```
docker-compose build
docker-compose up -d
```
eventually you can access the frontend from

http://localhost/3001

if you want to shutdown the process then use
````
docker-compose down 
````
or
````
docker-compose down -v
````
to remove the data volumes

***Change the port in docker-compose for `frontend` if `3001` is blocked for any reason.***

### Demo
Below is how the dashboard looks like with some demo data

![](images/demoDash.png)

**Note** 

Currency is hardcoded as danish crowns (DKK) in the frontend

## Backend
TBF
## Database
TBF
## Frontend

Frontend isn't my cup of tea and this was my first attempt to build something in ReactJS.

The template, idea and resources for this dashboard were inspired by the following repo and corresponding youtube tutorial

Github: https://github.com/ed-roh/finance-app

Youtube: https://www.youtube.com/watch?v=uoJ0Tv-BFcQ