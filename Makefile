include .env
export

export PROJECT_ROOT=.
export PROJECT_NAME=vectix

env-up:
	docker compose -f docker/docker-compose.dev.yaml -p $(PROJECT_NAME) up -d

env-down:
	docker compose -f docker/docker-compose.dev.yaml -p $(PROJECT_NAME) down