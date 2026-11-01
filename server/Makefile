.DEFAULT_GOAL := help

.PHONY: help up down logs psql sql db-generate db-custom db-migrate db-seed db-reset lint lint-fix test test-e2e

help: ## Показать список команд
	@grep -E '^[a-z0-9-]+:.*## ' $(MAKEFILE_LIST) | sed -E 's/:.*## /|/' | awk -F'|' '{ printf "  %-14s %s\n", $$1, $$2 }'

up: ## Поднять базу и дождаться готовности
	docker compose up -d --wait

down: ## Остановить контейнеры, данные сохраняются
	docker compose down

logs: ## Смотреть логи базы
	docker compose logs -f db

psql: ## Открыть консоль psql
	docker compose exec db sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

sql: export SQL_QUERY = $(q)
sql: ## Выполнить запрос: make sql q='select id from users'
	@: "$${SQL_QUERY:?Пример: make sql q='select id from users'}"
	@printf '%s\n' "$$SQL_QUERY" | docker compose exec -T db sh -c 'psql -v ON_ERROR_STOP=1 -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

db-generate: ## Сгенерировать миграцию: make db-generate name=add-tags
	@: "$${name:?Пример: make db-generate name=add-tags}"
	npm run db:generate -- --name=$(name)

db-custom: ## Создать пустую миграцию: make db-custom name=fix-fk
	@: "$${name:?Пример: make db-custom name=fix-fk}"
	npm run db:generate -- --custom --name=$(name)

db-migrate: ## Применить миграции
	npm run db:migrate

db-seed: ## Создать тестовых пользователей
	npm run db:seed

db-reset: ## УДАЛИТЬ данные базы, применить миграции и сид
	docker compose down -v
	docker compose up -d --wait
	npm run db:migrate
	npm run db:seed

lint: ## Проверить линтер и форматирование
	npm run lint

lint-fix: ## Исправить линтер и форматирование
	npm run lint:fix

test: ## Запустить unit-тесты
	npm test

test-e2e: ## Запустить e2e-тесты
	npm run test:e2e
