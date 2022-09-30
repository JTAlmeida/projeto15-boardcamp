import connection from "../database/db.js";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;

  try {
    let rentals;
    let SELECT = `
    SELECT rentals.*, 
    json_build_object('id', customers.id, 'name', customers.name) AS customer,
    json_bu\ild_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game 
    FROM rentals 
    JOIN customers ON customers.id = rentals."customerId" 
    JOIN games ON games.id = rentals."gameId" 
    JOIN categories ON categories.id = games."categoryId"
    `;

    function changeRentDateDisplay(rentals) {
      const rentDate = rentals.rows.forEach((rental) => {
        rental.rentDate = rental.rentDate.substring(0, 10);

        if (rental.returnDate) {
          rental.returnDate = rental.returnDate.substring(0, 10);
        }
      });

      return rentDate;
    }

    if (customerId && gameId) {
      rentals = await connection.query(
        `${SELECT} WHERE rentals."customerId" = ${customerId} AND rentals."gameId" = ${gameId};`
      );
      changeRentDateDisplay(rentals);

      return res.status(200).send(rentals.rows);
    } else if (customerId) {
      rentals = await connection.query(
        `${SELECT} WHERE rentals."customerId" = ${customerId};`
      );
      changeRentDateDisplay(rentals);

      return res.status(200).send(rentals.rows);
    } else if (gameId) {
      rentals = await connection.query(
        `${SELECT} WHERE rentals."gameId" = ${gameId};`
      );
      changeRentDateDisplay(rentals);

      return res.status(200).send(rentals.rows);
    }

    rentals = await connection.query(`${SELECT};`);
    changeRentDateDisplay(rentals);

    return res.status(200).send(rentals.rows);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = res.locals.rental;

  try {
    const checkCustomer = await connection.query(
      "SELECT id FROM customers WHERE id = $1;",
      [customerId]
    );

    if (checkCustomer.rowCount === 0) {
      return res.status(400).send({ message: "Invalid customerId" });
    }

    const checkGame = await connection.query(
      "SELECT * FROM games WHERE id = $1;",
      [gameId]
    );

    if (checkGame.rowCount === 0) {
      return res.status(400).send({ message: "Invalid gameId" });
    }

    const game = checkGame.rows[0];

    const checkRentals = await connection.query(
      `SELECT id FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null;`,
      [gameId]
    );

    if (
      checkRentals.rowCount > 0 &&
      game.stockTotal === checkRentals.rowCount
    ) {
      return res.status(400).send({ message: "Game unavailable." });
    }

    const originalPrice = daysRented * game.pricePerDay;

    await connection.query(
      'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, NOW(), $3, null, $4, null);',
      [customerId, gameId, daysRented, originalPrice]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function endRental(req, res) {
  const { id } = req.params;

  try {
    const checkRental = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );
    if (checkRental.rowCount === 0) {
      return res.status(404).send({ message: "Rental not found." });
    }

    const rental = checkRental.rows[0];

    if (rental.returnDate) {
      return res
        .status(400)
        .send({ message: "This rental has already been ended." });
    }

    const daysSinceRental =
      Math.floor(new Date().getTime() - new Date(rental.rentDate).getTime()) /
      DAY;

    let delayFee = 0;

    if (daysSinceRental > rental.daysRented) {
      delayFee = (daysSinceRental - rental.daysRented) * rental.originalPrice;
    }

    await connection.query(
      `UPDATE rentals SET "returnDate" = NOW(), "delayFee" = $1 WHERE id= $2;`,
      [delayFee, id]
    );

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const checkRental = await connection.query(
      `SELECT * FROM rentals WHERE id = $1;`,
      [id]
    );

    if (checkRental.rowCount===0){
        return res.status(404).send({message: "Rental not found."});
    }

    await connection.query(`DELETE FROM rentals WHERE id = $1;`,[id]);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
