import { Request, Response, NextFunction } from "express";
import client from "../../database";
import models from "../../models";
import utils from "../../utils";

const {Customer} = models;
const {CustomError} = utils;

export const listCustomers = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {cpf} = req.query;
        let sql; let customers;
        if (cpf) {
            sql = `
                SELECT * 
                FROM customers
                WHERE cpf LIKE $1;
            `;
            customers = await client.query(sql,[`${cpf}%`]);
        } else {
            sql = `
                SELECT * 
                FROM customers;
            `;
            customers = await client.query(sql);
        }
        res.status(200).send(customers.rows);
    } catch (e) {
        next(e);
    }
};

export const searchCustomer = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {id} = req.params;
        const sql = `
            SELECT * 
            FROM customers
            WHERE id = $1;
        `;
        const customer = await client.query(sql,[id]);
        if (customer.rowCount !== 1) {
            throw new CustomError(404, 'O cliente não existe');
        }
        res.status(200).send(customer.rows);
    } catch (e) {
        next(e);
    }
};

export const newCustomer = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {name, phone, cpf, birthday} = req.body;
        const customer = new Customer(name,phone,cpf,birthday);
        if (
            typeof cpf !== 'string' 
            || cpf.length !== 11 
            || typeof phone !== 'string' 
            || phone.length > 11 
            || phone.length < 10 
            || !name) {
            throw new CustomError(400, 'Erro de validação de cliente');
        }
        const searchSql = `
            SELECT cpf
            FROM customers
            WHERE cpf = $1;
        `;
        const hasCategory = await client.query(searchSql,[customer.cpf]);
        if (hasCategory.rowCount !== 0) {
            throw new CustomError(409,'O cliente já existe');
        }
        const insertSql = `
            INSERT INTO customers (name,phone,cpf,birthday) 
            VALUES ($1,$2,$3,$4);
        `;
        const values = [
            customer.name,
            customer.phone,
            customer.cpf,
            customer.birthday
        ];
        await client.query(insertSql,values);
        res.sendStatus(201);
    } catch (e) {
        next(e);
    }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {name, phone, cpf, birthday} = req.body;
        const {id} = req.params;
        const customer = new Customer(name,phone,cpf,birthday,parseInt(id,10));
        if (
            typeof cpf !== 'string' 
            || cpf.length !== 11 
            || typeof phone !== 'string' 
            || phone.length > 11 
            || phone.length < 10 
            || !name) {
            throw new CustomError(400, 'Erro de validação de cliente');
        }
        const sql = `
            UPDATE customers 
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5;
        `;
        const values = [
            customer.name,
            customer.phone,
            customer.cpf,
            customer.birthday,
            customer.id
        ];
        await client.query(sql,values);
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
};


