const express = require("express");
const app = express();

const logger = require("morgan");
const cors = require("cors");

const port = 5000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/api/stripe-payment", (req, res) => {
  const stripe = require("stripe")(
    "sk_test_51JSxdmKLp2r7ix2Pd2k8eknPuSjKYkFARdemkEM60UkcqYppN1klpWupUDw41kOVTt6Xdr0LbtsVmNsKbmhPcYR400sUv6LASz"
  );

  const { amount, email, token } = req.body;

  stripe.customers
    .create({
      email: email,
      source: token.id,
      name: token.card.name,
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: parseFloat(amount) * 100,
        description: `Payment for USD ${amount}`,
        currency: "USD",
        customer: customer.id,
      });
    })
    .then((charge) => res.status(200).send(charge))
    .catch((err) => console.log(err));
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
