import joi from "joi";

export default function customerValidation(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;

  const validation = joi
    .object({
      name: joi.string().required(),
      phone: joi
        .string()
        .min(10)
        .max(11)
        .pattern(/^[0-9]+$/)
        .required(),
      cpf: joi.string().length(11).pattern(/^[0-9]+$/),
      birthday: joi.date().required(),
    })
    .validate({ name, phone, cpf, birthday }, { abortEarly: false });

  if (validation.error) {
    const err = validation.error.details.map((error) => {
      return error.message;
    });
    return res.status(400).send({ message: err });
  };
  
  res.locals.customer = { name, phone, cpf, birthday };
  next();
}
