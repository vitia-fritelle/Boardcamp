import { Request, Response, NextFunction } from "express";
import client from "../../database";
import models from "../../models";
import utils from "../../utils";

const {Category} = models;
const {CustomError} = utils;

export const listCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await client.query(`SELECT * FROM categories;`);  
        res.status(200).send(categories.rows);
    } catch (e) {
        next(e);
    }
};

export const newCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name} = req.body;
        const category = new Category(name);
        const values = [category.name];
        const searchSql = `SELECT name FROM categories WHERE name = $1`;
        const hasCategory = await client.query(searchSql,values);
        if (hasCategory.rowCount !== 0) {
            throw new CustomError(409,'A categoria já existe');
        }
        const insertSql = `INSERT INTO categories (name) VALUES ($1);`;
        await client.query(insertSql, values);
        res.sendStatus(201);
    } catch (e) {
        next(e);
    }
};
