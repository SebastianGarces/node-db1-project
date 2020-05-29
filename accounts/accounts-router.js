const express = require("express");

const db = require("../data/dbConfig");

const router = express.Router();

// /API/ACCOUNTS/

// GET ALL
router.get("/", async (req, res) => {
	try {
		const accounts = await db("accounts");
		res.status(200).json(accounts);
	} catch (error) {
		res.status(500).json({ errorMessage: "Error getting accounts", error });
	}
});

// GET BY ID
router.get("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const account = await db("accounts").where({ id: id });
		res.status(200).json(account);
	} catch (error) {
		res.status(500).json({
			errorMessage: "Error getting specified account",
			error,
		});
	}
});

// CREATE
router.post("/", async (req, res) => {
	const newAccount = req.body;

	try {
		const [newAccountId] = await db("accounts").insert(newAccount);
		const createdAccount = await db("accounts").where({ id: newAccountId });
		res.status(200).json(createdAccount);
	} catch (error) {
		res.status(500).json({ errorMessage: "Error creating account", error });
	}
});

// UPDATE
router.patch("/:id", async (req, res) => {
	const { id } = req.params;
	const changes = req.body;

	try {
		const updateSuccess = await db("accounts")
			.where({ id: id })
			.update(changes);

		const updatedAccount = await db("accounts").where({ id: id });

		if (updateSuccess > 0) {
			res.status(200).json(updatedAccount);
		} else {
			res.status(400).json({ message: "No record was updated" });
		}
	} catch (error) {
		res.status(500).json({ errorMessage: "Error updating account", error });
	}
});

// DELETE
router.delete("/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const deletedAccount = await db("accounts").where({ id: id });
		const deleteSuccess = await db("accounts").where({ id: id }).del();

		if (deleteSuccess > 0) {
			res.status(200).json({
				message: "Account deleted",
				deletedAccount,
			});
		} else {
			res.status(400).json({ message: "No record was deleted" });
		}
	} catch (error) {
		res.status(500).json({ errorMessage: "Error deleting account", error });
	}
});

module.exports = router;
