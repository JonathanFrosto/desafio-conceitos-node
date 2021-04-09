const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).send();
  }

  return next();
}

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, likes: 0, url, techs };

  repositories.push(repositorie);
  response.status(201).json(repositorie);
});

app.put("/repositories/:id", validId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex(repositorie => repositorie.id == id);

  if (index == -1) {
    return response.status(404).send();
  }

  const repositorie = { ...repositories[index], title, url, techs };

  repositories[index] = repositorie
  response.json(repositorie);
});

app.delete("/repositories/:id", validId, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repositorie => repositorie.id == id);

  if (index == -1) {
    return response.status(404).send();
  }

  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validId, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repositorie => repositorie.id == id);

  if (index == -1) {
    return response.status(404).send();
  }

  const repositorie = repositories[index];
  repositorie.likes = repositorie.likes + 1;

  repositories[index] = repositorie
  response.json(repositorie);
});

module.exports = app;
