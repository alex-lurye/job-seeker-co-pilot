# [ApplySwift - a job-seeker AI co-pilot](http://applyswift.com)

This project is based on **[React Flask Authentication](https://blog.appseed.us/react-flask-authentication/)**

The goal of this project is to help job seekers optimize the chores associated with applying for positions.
The first problem that we aim to solve is to tailor one's resume to a particular position description.

## The project structure

The project is divided into four main services:

1. Frontend: react-ui
2. Backend:  api-server-flask
3. AI generator: generator-service
4. Vector database: weaviate
   
## ✨ The project deployment

The project uses docker-compose for deployment. Each of the services has its own docker-compose.yml file and can be deployed separately.

Please note: current implementation assumes the backend and AI generator are running on the same host (share a volume)
