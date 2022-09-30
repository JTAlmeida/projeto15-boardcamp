import connection from "../database/db.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    let customers;

    if (cpf) {
      customers = await connection.query(
        `SELECT * FROM customers WHERE cpf LIKE '${cpf}%';`
      );
      return res.status(200).send(customers.rows);
    }
    customers = await connection.query("SELECT * FROM customers;");

    return res.status(200).send(customers.rows);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function getCustomer(req, res) {
  const { id } = req.params;

  try {
    const customer = await connection.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    return res.status(200).send(customer.rows[0]);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = res.locals.customer;

  try {
    const checkExistingCpf = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [cpf]
    );

    if (checkExistingCpf.rowCount > 0) {
      return res
        .status(409)
        .send({ message: "This CPF is already being used." });
    }

    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );

    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function updateCustomer(req, res) {
  try {
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}
