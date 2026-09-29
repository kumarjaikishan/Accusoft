const Category = require("../modals/category_schema.js");
const Section = require("../modals/section_schema.js");
const Item = require("../modals/items_schema.js");
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apierror');

// CREATE CATEGORY
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    try {
        const category = await Category.create({
            name: name.trim(),
            userId: req?.user?.userId
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new ApiError(400, "Category already exists for this user");
        }
        throw error;
    }
});

// GET ALL CATEGORIES OF USER — scoped strictly to the requesting user
const getCategories = asyncHandler(async (req, res) => {
    const userId = req?.user?.userId;
    if (!userId) throw new ApiError(401, 'Not authenticated');

    const categories = await Category.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $sort: { createdAt: 1 } },
        {
            $lookup: {
                from: 'sections',
                localField: '_id',
                foreignField: 'category',
                as: 'sections',
                pipeline: [
                    { $sort: { createdAt: 1 } },
                    {
                        $lookup: {
                            from: 'items',
                            localField: '_id',
                            foreignField: 'sectionId',
                            as: 'items',
                            pipeline: [{ $sort: { createdAt: 1 } }]
                        }
                    }
                ]
            }
        }
    ]);

    res.json({
        success: true,
        data: { categories }
    });
});

// UPDATE CATEGORY
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    const category = await Category.findByIdAndUpdate(
        id,
        { name: name.trim() },
        { new: true }
    );

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    res.json({
        success: true,
        data: category
    });
});

// DELETE CATEGORY
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    res.json({
        success: true,
        message: "Category deleted successfully"
    });
});

/* CREATE SECTION */
const createSection = asyncHandler(async (req, res) => {
    const { name, type, category } = req.body;
    const userId = req?.user?.userId;

    if (!name || !name.trim()) {
        throw new ApiError(400, "Section name is required");
    }

    const section = await Section.create({
        name: name.trim(),
        type,
        category,
        userId
    });

    res.status(201).json({
        success: true,
        data: section
    });
});

/* GET SECTIONS BY CATEGORY */
const getSectionsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const sections = await Section
        .find({ category: categoryId })
        .populate("category", "name")
        .sort({ createdAt: 1 });

    res.json({
        success: true,
        data: sections
    });
});

/* GET ALL SECTIONS BY USER */
const getSectionsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const sections = await Section
        .find({ userId })
        .populate("category", "name")
        .sort({ createdAt: 1 });

    res.json({
        success: true,
        data: sections
    });
});

/* UPDATE SECTION */
const updateSection = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const updated = await Section.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );

    if (!updated) {
        throw new ApiError(404, "Section not found");
    }

    res.json({
        success: true,
        data: updated
    });
});

/* DELETE SECTION */
const deleteSection = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await Section.findByIdAndDelete(id);
    if (!deleted) {
        throw new ApiError(404, "Section not found");
    }

    res.json({
        success: true,
        message: "Section deleted"
    });
});

/* CREATE ITEM */
const createItem = asyncHandler(async (req, res) => {
    const {
        answer,
        category,
        description,
        difficulty,
        sectionId,
        solutions,
        title,
        type
    } = req.body;

    const userId = req?.user?.userId;

    let itemData = {
        userId,
        category,
        description,
        difficulty,
        sectionId,
        title,
        type
    };

    if (type === "dsa") {
        itemData.solutions = (solutions || []).map(({ label, code }) => ({
            label,
            code
        }));
        itemData.answer = "";
    } else if (type === "theory") {
        itemData.answer = answer || "";
        itemData.solutions = [];
    }

    const item = await Item.create(itemData);

    res.status(201).json({
        success: true,
        data: item
    });
});

/* GET ITEMS BY SECTION */
const getItemsBySection = asyncHandler(async (req, res) => {
    const { sectionId } = req.params;

    const items = await Item.find({ sectionId })
        .populate("category", "name")
        .populate("sectionId", "name");

    res.json({
        success: true,
        data: items
    });
});

/* GET ITEMS BY USER */
const getItemsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const items = await Item.find({ userId })
        .populate("category", "name")
        .populate("sectionId", "name");

    res.json({
        success: true,
        data: items
    });
});

/* UPDATE ITEM */
const updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        answer,
        category,
        description,
        difficulty,
        sectionId,
        solutions,
        title,
        type
    } = req.body;

    let updateData = {
        category,
        description,
        difficulty,
        sectionId,
        title,
        type
    };

    if (type === "dsa") {
        updateData.solutions = solutions || [];
        updateData.answer = "";
    } else if (type === "theory") {
        updateData.answer = answer || "";
        updateData.solutions = [];
    }

    const updatedItem = await Item.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );

    if (!updatedItem) {
        throw new ApiError(404, "Item not found");
    }

    res.json({
        success: true,
        data: updatedItem
    });
});

/* DELETE ITEM */
const deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) {
        throw new ApiError(404, "Item not found");
    }

    res.json({
        success: true,
        message: "Item deleted successfully"
    });
});

module.exports = {
    deleteItem,
    deleteCategory,
    createCategory,
    getCategories,
    updateCategory,
    createSection,
    getSectionsByCategory,
    getSectionsByUser,
    updateSection,
    deleteSection,
    updateItem,
    createItem,
    getItemsByUser,
    getItemsBySection,
};