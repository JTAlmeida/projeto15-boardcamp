import connection from "../database/db.js";

export async function getGames(req, res) {
  try {
    const games = await connection.query(
      'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON categories.id = games."categoryId";'
    );

    res.status(200).send(games.rows);
  } catch (error) {
    return res.status(500).send({ erro: error.message });
  }
}

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;

  try {
    const checkCategory = await connection.query(
      'SELECT * FROM categories WHERE id = $1;',
      [categoryId]
    );

    if (checkCategory.rowCount === 0) {
      return res.status(400).send({ message: "Category doesn't exist" });
    }

    const checkName = await connection.query(
      "SELECT * FROM games WHERE name = $1;",
      [name]
    );

    if (checkName.rowCount > 0) {
      return res
        .status(409)
        .send({ message: `There's already a game with the name "${name}"` });
    }

    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    return res.status(500).send({ erro: error.message });
  }
}