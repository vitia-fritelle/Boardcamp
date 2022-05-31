import {Router} from 'express';
import controllers from '../../controllers';

const {listRentals, finishRental, newRental, deleteRental} = controllers;

const router = Router();

router
.route('/')
.get(listRentals)
.post(newRental);

router.delete('/:id',deleteRental);
router.post('/:id/return',finishRental);

export default router;