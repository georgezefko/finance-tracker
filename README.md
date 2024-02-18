# Built an App for tracking personal finances using NodeJS, ExpressJS, PostgreSQL, ReactJS, Typescript

## Motivation
Through this project, I had the opportunity to strengthen my skills and gain a comprehensive understanding of several key areas:

1. Developing a basic REST API using ExpressJS/Typescript to handle backend operations.
2. Designing and implementing a data model in PostgreSQL tailored to my specific requirements.
3. Creating a user-friendly dashboard with ReactJS for the frontend.
4. Containerizing the application's components using Docker to simplify deployment and ensure consistency across environments.
5. Orchestrating all these components to work seamlessly together, providing a cohesive user experience.

I chose to create a finance app because I was in search of a robust solution for documenting and managing my finances. 
The goal was to move away from the current approach of using multiple, extensive Excel spreadsheets, and instead, consolidate everything into a single, efficient platform.

**NOTE**  
This is still an in progress project and intended for personl use.
Hence there is plenty room for development and adjustments if you want to use it and tailor it to your needs 

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

Then to start the containers you run

```
docker-compose up -d
```

you can also build your container by
````
docker-compose up --build
````

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

The template, idea and resources for this dashboard were inspired by the following repo and corresponding youtube tutorial

Github: https://github.com/ed-roh/finance-app

Youtube: https://www.youtube.com/watch?v=uoJ0Tv-BFcQ