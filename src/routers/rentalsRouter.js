import { Router } from "express";
import {
  getRentals,
  createRental,
  endRental,
  deleteRental,
} from "../controllers/rentalsController.js";
import rentalValidation from '../middlewares/rentalsMiddleware.js';

const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', rentalValidation, createRental);
rentalsRouter.post('/rentals/:id/return', endRental);
rentalsRouter.delete('/rentals/:id', deleteRental);

export default rentalsRouter;