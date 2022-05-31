import { Request, Response, NextFunction } from "express";
import client from "../../database";
import models from "../../models";
import utils from "../../utils";

const {Rental} = models;
const {CustomError} = utils;

export const listRentals = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {customerId, gameId} = req.query;
        let rentals;
        let sql = `
            SELECT 
            rentals.*,
            customers.id,
            customers.name,
            games.id,
            games.name,
            games."categoryId",
            categories."categoryName"
            FROM rentals
            INNER JOIN customers
            ON rentals."customerId" = customers.id
            INNER JOIN games
            ON rentals."gameId" = games.id
            INNER JOIN categories
            ON games."categoryId" = categories.id
        `;
        if (customerId) {
            sql += 'WHERE customers.id = $1;';
            rentals = await client.query(sql,[customerId]);
        } else if (gameId) {
            sql += 'WHERE games.id = $1;';
            rentals = await client.query(sql,[gameId]);
        } else {
            sql += ';';
            rentals = await client.query(sql);
        }
        res.status(200).send(rentals.rows);
    } catch (e) {
        next(e);
    }
};

export const finishRental = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {id} = req.params;
        const availableSql = `
            SELECT *
            FROM rentals
            WHERE id = $1;
        `;
        const rental = await client.query(availableSql,[id]);
        if (rental.rowCount !== 1) {
            throw new CustomError(404, 'O aluguel não existe');
        }
        if(rental.rows[0].delayFee !== null) {
            throw new CustomError(400, 'O aluguel já está finalizado');
        }
        const sql = `
            UPDATE rentals
            SET "returnDate"=$1, "delayFee"=$2
            WHERE id=$3;
        `;
        const now = new Date();
        const delay = now.valueOf()-Date.parse(rental.rows[0].rentDate)/(24*60*60*1000);
        const values = [
            now.toISOString(),
            delay > 0 ? delay*rental.rows[0].originalPrice:0,
            id
        ];
        await client.query(sql,values);
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};

export const newRental = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {customerId, gameId, daysRented} = req.body;
        if (daysRented <= 0) {
            throw new CustomError(400, 'Ele deve alugar por um período válido.');
        }
        const sql = `
            SELECT *
            FROM games
            WHERE id = $1;
        `;
        const game = await client.query(sql,[gameId]);
        if (game.rowCount !== 1) {
            throw new CustomError(400, 'O jogo não existe');
        }
        const originalPrice = daysRented * game.rows[0].pricePerDay;
        const customer = new Rental(customerId,gameId,daysRented,originalPrice);
        const customerSql = `
            SELECT *
            FROM customers
            WHERE id = $1;
        `;
        const hasCustomer = await client.query(customerSql,[customer.id]);
        if (hasCustomer.rowCount !== 1) {
            throw new CustomError(400,'O consumidor não existe');
        }
        const insertSql = `
            INSERT INTO ("gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") 
            VALUES ($1,$2,$3,$4,$5,$6);
        `;
        const values = [
            customer.gameId,
            customer.rentDate,
            customer.daysRented,
            customer.returnDate,
            customer.originalPrice,
            customer.delayFee
        ];
        await client.query(insertSql,values);
        const availableSql = `
            SELECT *
            FROM rentals
            JOIN games
            ON rentals."gameId" = games.id
            WHERE rentals."gameId" = $1;
        `;
        const rentedGames = await client.query(availableSql,[gameId]);
        if (rentedGames.rows[0].stockTotal < rentedGames.rowCount) {
            throw new CustomError(400, 'Há alugueis abertos acima da quantidade de jogos em estoque.');
        }
        res.sendStatus(201);
    } catch (e) {
        next(e);
    }
};

export const deleteRental = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {id} = req.params;
        const availableSql = `
            SELECT *
            FROM rentals
            WHERE id = $1;
        `;
        const rental = await client.query(availableSql,[id]);
        if(rental.rowCount !== 1) {
            throw new CustomError(404, 'O aluguel não existe');
        }
        if(rental.rows[0].delayFee !== null) {
            throw new CustomError(400, 'O aluguel já está finalizado');
        }
        const deleteSql = `
            DELETE FROM rental
            WHERE id = $1;
        `;
        await client.query(deleteSql,[id]);
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};