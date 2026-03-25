[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/gwexHg2e)
## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd quiz
```

2. Start the Docker containers:

```bash
docker-compose up -d
```

3. The application should now be running at http://localhost:3000

## Viewing the Database

You can view the database contents using Prisma Studio:

```bash
docker exec -it quiz-app npx prisma studio --port 5555
```

Then open http://localhost:5555 in your browser.

Alternatively, you can use psql to view the database:

```bash
docker exec -it quiz-db psql -U postgres -d quizdb
```
