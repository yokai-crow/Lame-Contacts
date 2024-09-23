const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const contactModel = require("../models/contactModel");
const mongoose = require("mongoose");

//@desc Get all contacts
//@route Get /api/contacts
//@access private
const getContacts = asyncHandler(async (request, response) => {
  
  const contacts = await Contact.find({ user_id: request.user.id });

  // Check if the contacts array is empty
  if (contacts.length === 0) {
      return response.status(404).json({ message: "No contacts found for this user." });
  }

  // Check if all contacts belong to the user
  const hasPermission = contacts.every(contact => contact.user_id.toString() === request.user.id);
  if (!hasPermission) {
      return response.status(403).json({ message: "User doesn't have enough permission to proceed." });
  }

  response.status(200).json(contacts);
});

//@desc create all contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (request, response) => {
  console.log("request body is:", request.body);
  const { name, email, phone } = request.body;
  if (!name || !email || !phone) {
    response.status(400);
    throw new Error("all fields required");
  }
  const contact = await contactModel.create({
    name,
    email,
    phone,
    user_id: request.user.id,
  });

  response.status(201).json(contact);
});

//@desc Get contact
//@route Get /api/contacts/:id
//@access private
const getContact = asyncHandler(async (request, response) => {
  // const contact = await Contact.findById(request.params.id); //yesle id ko exact count ma id diyenau vane error falxa
  // if(!contact){
  //   response.status(404);
  //   throw new Error("contact not found");
  // }
  // response.status(201).json(contact);
  const { id } = request.params;

  // Validate ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ message: "Invalid contact ID" });
  }

  const contact = await Contact.findById(id);
  if (!contact) {
    response.status(404);
    throw new Error("Contact not found");
  }

  response.status(201).json(contact);
});

//@desc edit contacts
//@route PUT /api/contacts/:id
//@access private
const editContact = asyncHandler(async (request, response) => {
  // Convert request.params.id to ObjectId
  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(request.params.id);
  } catch (error) {
    return response.status(400).json({ message: "Invalid contact ID" });
  }

  const contact = await Contact.findById(objectId);
  if (!contact) {
    return response.status(404).json({ message: "Contact not found" });
  }

  if(contact.user_id.toString()!== request.user.id){
    response.status(403);
    throw new Error("user don't have enough permission to proceed")
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    objectId,
    request.body,
    { new: true, runValidators: true }
  );

  response.status(200).json(updatedContact);
});

//@desc delete contacts
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (request, response) => {
  // Convert request.params.id to ObjectId
  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(request.params.id);
  } catch (error) {
    return response.status(400).json({ message: "Invalid contact ID" });
  }

  const contact = await Contact.findById(objectId);
  if (!contact) {
    return response.status(404).json({ message: "Contact not found" });
  }

  if(contact.user_id.toString()!== request.user.id){
    response.status(403);
    throw new Error("user don't have enough permission to proceed")
  }

  // Delete the contact
  await Contact.findByIdAndDelete(objectId);

  // Return the deleted contact
  response.status(200).json(contact);
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  editContact,
  deleteContact,
};
