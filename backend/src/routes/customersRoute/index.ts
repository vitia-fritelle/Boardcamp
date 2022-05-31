import {Router} from "express";
import controllers from "../../controllers";

const {listCustomers, newCustomer, searchCustomer, updateCustomer} = controllers;
const router = Router();

router
.route('/')
.get(listCustomers)
.post(newCustomer);

router
.route('/:id')
.get(searchCustomer)
.put(updateCustomer);

export default router;
