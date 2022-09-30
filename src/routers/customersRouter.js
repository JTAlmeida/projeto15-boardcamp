import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
} from "../controllers/customersController.js";
import customerValidation from "../middlewares/customersMiddleware.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", customerValidation, createCustomer);
customersRouter.put("/customers/:id", customerValidation, updateCustomer);

export default customersRouter;
