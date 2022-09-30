import connection from "../database/db.js";

export async function getCategories(req, res) {
  try {
    const categories = await connection.query(`SELECT * FROM categories`);

    return res.status(200).send(categories.rows);
  } catch (error) {
    return res.status(500).send({ erro: error.message });
  }
}

export async function createCategory(req, res) {
  const { name } = res.locals.category;

  try {
    const checkExisting = await connection.query(
      "SELECT * FROM categories WHERE name = $1",
      [name]
    );

    if (checkExisting.rowCount > 0) {
      return res.status(409).send({
        message: `There's already a category with the name "${name}"`,
      });
    }

    await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
