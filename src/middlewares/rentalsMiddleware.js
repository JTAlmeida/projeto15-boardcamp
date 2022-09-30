import joi from "joi";

export default function rentalValidation(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  const validation = joi
    .object({
      customerId: joi.number().required(),
      gameId: joi.number().required(),
      daysRented: joi.number().min(1).required(),
    })
    .validate({ customerId, gameId, daysRented }, { abortEarly: false });

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(400).send({ message: err });
  }
  res.locals.rental = { customerId, gameId, daysRented };
  next();
}
