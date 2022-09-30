import { Router } from 'express';
import { getCategories, createCategory } from "../controllers/categoriesController.js"
import categoryValidation from "../middlewares/categoriesMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", categoryValidation, createCategory);

export default categoriesRouter;