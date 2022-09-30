import joi from "joi";

export default function gamesValidation(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const validation = joi
    .object({
      name: joi.string().required(),
      image: joi.string().uri().required(),
      stockTotal: joi.number().greater(0).required(),
      categoryId: joi.number().greater(0).required(),
      pricePerDay: joi.number().greater(0).required(),
    })
    .validate(
      { name, image, stockTotal, categoryId, pricePerDay },
      { abortEarly: false }
    );

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(400).send({ message: err });
  }

  res.locals.game = { name, image, stockTotal, categoryId, pricePerDay };
  next();
}
