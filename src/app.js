const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo)
  return response.status(200).json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  const repoIndex = repositories.findIndex(repository => repository.id === id)

  if(repoIndex < 0)
    return response.status(400).json({ error:'Repository not found!' })

  const repo = {
    id,
    title,
    url,
    techs,
    likes: 1
  }

  repositories[repoIndex] = repo
  return response.json(repo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repoIndex = repositories.findIndex(repository => repository.id === id)

  if(repoIndex < 0)
    return response.status(400).json({ error:'Repository not found!' })
  
  repositories.splice(repoIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repo = repositories.find(repository => repository.id === id)

  if(!repo)
    return response.status(400).send()

  repo.likes += 1
  return response.status(200).json(repo)
});

module.exports = app;
