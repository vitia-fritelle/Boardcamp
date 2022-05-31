import {Router} from "express";
import controllers from "../../controllers";

const router = Router();

const {listCategories, newCategory} = controllers;

router
.route('/')
.get(listCategories)
.post(newCategory);

export default router;
