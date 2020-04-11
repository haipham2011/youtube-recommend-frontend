### Requirements:

    - docker
    - docker-compose

### How to start

- `git clone <project>`
- `cd <project-folder>`
- `docker-compose build` -> build the images
- `docker-compose up -d` -> bring up the containers

To execute a command in a container:

`docker-compose exec <service-name> <the-command>`

`service-name` is the name of the service defined in `docker-compose.yml`

**For example:**

```bash
# To start the frontend server
docker-compose exec frontend npm start

# To start the backend server
docker-compose exec server npm start
```
