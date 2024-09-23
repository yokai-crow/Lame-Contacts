const express = require("express");
const router = express.Router();
const {getContacts, getContact, createContact, editContact, deleteContact} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");



router.use(validateToken);
router.route('/').get(getContacts).post(createContact);
router.route('/:id').get(getContact).put(editContact).delete(deleteContact);

//jasari gare pani vayo
// router.route('/').post(createContact);

// router.route("/:id").get(getContact);

// router.route('/:id').put(editContact);

// router.route('/:id').delete(deleteContact);


module.exports = router;