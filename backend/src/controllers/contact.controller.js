import Contact from "../models/Contact.js";

// @desc    Submit new contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    const ipAddress = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const contact = await Contact.create({
      fullName,
      email,
      phone,
      subject,
      message,
      ipAddress,
      userAgent
    });

    res.status(201).json({
      success: true,
      message: "Your query has been submitted successfully. We will contact you soon.",
      data: {
        id: contact._id,
        fullName: contact.fullName,
        email: contact.email,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error("Contact form error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    
    let query = { isArchived: false };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Contact.countDocuments(query)
    ]);
    
    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts"
    });
  }
};

// @desc    Get single contact by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }
    
    if (contact.status === "pending") {
      contact.status = "read";
      await contact.save();
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
    
  } catch (error) {
    console.error("Get contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact"
    });
  }
};

// @desc    Update contact status
// @route   PATCH /api/contact/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === "replied" && { repliedAt: Date.now() })
      },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: contact
    });
    
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status"
    });
  }
};

// @desc    Add reply to contact
// @route   POST /api/contact/:id/reply
// @access  Private/Admin
export const addReply = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        replyMessage,
        status: "replied",
        repliedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: contact
    });
    
  } catch (error) {
    console.error("Add reply error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add reply"
    });
  }
};

// @desc    Delete contact (soft delete / archive)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Contact archived successfully"
    });
    
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact"
    });
  }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats/summary
// @access  Private/Admin
export const getContactStats = async (req, res) => {
  try {
    const [total, pending, read, replied, spam, today] = await Promise.all([
      Contact.countDocuments({ isArchived: false }),
      Contact.countDocuments({ status: "pending", isArchived: false }),
      Contact.countDocuments({ status: "read", isArchived: false }),
      Contact.countDocuments({ status: "replied", isArchived: false }),
      Contact.countDocuments({ status: "spam", isArchived: false }),
      Contact.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
        isArchived: false
      })
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        read,
        replied,
        spam,
        today
      }
    });
    
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics"
    });
  }
};