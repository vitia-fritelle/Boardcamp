import { Request, Response, NextFunction } from "express";
import client from "../../database";
import models from "../../models";
import utils from "../../utils";

const {Game} = models;
const {CustomError} = utils;

export const listGames = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {name} = req.query;
        let sql; let games;
        if (name) {
            sql = `
                SELECT * 
                FROM games
                WHERE name ILIKE $1;
            `;
            games = await client.query(sql,[`${name}%`]);
        } else {
            sql = `
                SELECT * 
                FROM games;
            `;
            games = await client.query(sql);
        }
        res.status(200).send(games.rows);
    } catch (e) {
        next(e);
    }
};

export const newGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name,image,stockTotal,categoryId,pricePerDay} = req.body;
        const game = new Game(name,image,stockTotal,categoryId,pricePerDay);
        const values = [
            game.name,
            game.image,
            game.stockTotal,
            game.categoryId,
            game.pricePerDay
        ];
        const searchSql = `SELECT name FROM games WHERE name = $1;`;
        const hasCategory = await client.query(searchSql,[game.name]);
        if (hasCategory.rowCount !== 0) {
            throw new CustomError(409,'O jogo já existe');
        }
        const insertSql = `
            INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") 
            VALUES ($1,$2,$3,$4,$5);
        `;
        await client.query(insertSql, values);
        res.sendStatus(201);
    } catch (e) {
        next(e);
    }
};