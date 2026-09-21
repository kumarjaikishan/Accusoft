const Contact = require('../modals/contact_schema');

// 1. Submit a public contact message
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
    });

    return res.status(201).json({
      message: "Your message has been received successfully!",
      contactId: newContact._id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit message", error: error.message });
  }
};

// 2. Admin: Get all contact messages
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ contacts });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve contact messages", error: error.message });
  }
};

// 3. Admin: Update status (read/resolved/unread)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['unread', 'read', 'resolved'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    return res.status(200).json({ message: "Status updated successfully", contact: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};

// 4. Admin: Delete contact message
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete message", error: error.message });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
};
