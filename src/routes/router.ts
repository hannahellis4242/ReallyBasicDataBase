import { Router } from "express";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "http-status";
import { join } from "path";
import { v4 } from "uuid";

const storagePath = join(__dirname, "..", "..", "store");

const createStorageArea = async () => {
  if (existsSync(storagePath)) {
    return;
  }
  await mkdir(storagePath);
};

const router = async (): Promise<Router> => {
  await createStorageArea();
  return Router()
    .post("/", async (req, res) => {
      const { body } = req;
      try {
        const id = v4();
        await writeFile(join(storagePath, `${id}.json`), JSON.stringify(body));
        res.status(OK).json(id);
      } catch (e) {
        console.log(e);
        if (e instanceof Error) {
          console.error(e.message);
          console.error(e.name);
          res.status(BAD_REQUEST).json("invalid json");
        }
      }
    })
    .get("/id/:id", async (req, res) => {
      const { id } = req.params;
      const filepath = join(storagePath, `${id}.json`);
      if (!existsSync(filepath)) {
        res.sendStatus(NOT_FOUND);
        return;
      }
      await readFile(filepath)
        .then((buffer) => buffer.toString())
        .then((data) => JSON.parse(data))
        .then((data) => res.status(OK).json(data))
        .catch((e) => {
          console.log(e);
          res.sendStatus(INTERNAL_SERVER_ERROR);
        });
    });
};

export default router;
