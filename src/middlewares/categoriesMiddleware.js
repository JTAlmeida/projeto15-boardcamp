import joi from 'joi';

export default function categoryValidation(req, res, next) {
  const { name } = req.body;

  const validation = joi
    .object({
      name: joi.string().required(),
    })
    .validate({ name });

  if (validation.error) {
    return res.status(400).send({ message: validation.error.details[0].message });
  }

  res.locals.category = { name };
  next();
}
