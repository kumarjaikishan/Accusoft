const Category = require("../modals/category_schema.js");
const Section = require("../modals/section_schema.js");
const Item = require("../modals/items_schema.js");


// CREATE CATEGORY
 const createCategory = async (req, res) => {
    // console.log("request received on cretacatergory", req.user);

    try {
        const { name } = req.body;

        const category = await Category.create({
            name,
            userId: req?.user?.userId
        });

        res.status(201).json({
            success: true,
            data: category
        });

    } catch (error) {
        console.log(error)

        // duplicate category
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category already exists for this user"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL CATEGORIES OF USER
 const getCategories = async (req, res) => {
    try {
        const userId = req?.user?.userId;
        const categories = await Category.find().sort({ createdAt: 1 });
        const sections = await Section.find().sort({ createdAt: 1 });
        const items = await Item.find().sort({ createdAt: 1 });
        // const categories = await Category.find({ userId }).sort({ createdAt: 1 });
        // const sections = await Section.find({ userId }).sort({ createdAt: 1 });
        // const items = await Item.find({ userId }).sort({ createdAt: 1 });

        res.json({
            success: true,
            data: { categories, sections, items }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// UPDATE CATEGORY
 const updateCategory = async (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        res.json({
            success: true,
            data: category
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// DELETE CATEGORY
 const deleteCategory = async (req, res) => {
    try {

        const { id } = req.params;

        await Category.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



/* CREATE SECTION */
 const createSection = async (req, res) => {
    try {

        const { name, type, category } = req.body;
        let userId = req?.user?.userId;

        const section = await Section.create({
            name,
            type,
            category,
            userId
        });

        res.status(201).json({
            success: true,
            data: section
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/* GET SECTIONS BY CATEGORY */
 const getSectionsByCategory = async (req, res) => {
    try {

        const { categoryId } = req.params;

        const sections = await Section
            .find({ category: categoryId })
            .populate("category", "name");

        res.json({
            success: true,
            data: sections
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/* GET ALL SECTIONS BY USER */
 const getSectionsByUser = async (req, res) => {
    try {

        const { userId } = req.params;

        const sections = await Section
            .find({ userId })
            .populate("category", "name");

        res.json({
            success: true,
            data: sections
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/* UPDATE SECTION */
 const updateSection = async (req, res) => {
    try {

        const { id } = req.params;

        const updated = await Section.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            data: updated
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/* DELETE SECTION */
 const deleteSection = async (req, res) => {
    try {

        const { id } = req.params;

        await Section.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Section deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



/* CREATE ITEM */
 const createItem = async (req, res) => {

    try {

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

        // if (type === "dsa") {
        //     itemData.solutions = solutions || [];
        //     itemData.answer = "";
        // }
        if (type === "dsa") {
            itemData.solutions = (solutions || []).map(({ label, code }) => ({
                label,
                code
            }));
            itemData.answer = "";
        }

        if (type === "theory") {
            itemData.answer = answer || "";
            itemData.solutions = [];
        }

        const item = await Item.create(itemData);

        res.status(201).json({
            success: true,
            data: item
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/* GET ITEMS BY SECTION */
 const getItemsBySection = async (req, res) => {
    try {

        const { sectionId } = req.params;

        const items = await Item.find({ section: sectionId })
            .populate("category", "name")
            .populate("section", "name");

        res.json({
            success: true,
            data: items
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/* GET ITEMS BY USER */
 const getItemsByUser = async (req, res) => {
    try {

        const { userId } = req.params;

        const items = await Item.find({ userId })
            .populate("category", "name")
            .populate("section", "name");

        res.json({
            success: true,
            data: items
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/* UPDATE ITEM */
 const updateItem = async (req, res) => {
    try {

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

        // handle conditional fields
        if (type === "dsa") {
            updateData.solutions = solutions || [];
            updateData.answer = "";
        }

        if (type === "theory") {
            updateData.answer = answer || "";
            updateData.solutions = [];
        }

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedItem
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/* DELETE ITEM */
 const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        await Item.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Item deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = { deleteItem,deleteCategory,createCategory,getCategories,updateCategory,createSection,getSectionsByCategory,getSectionsByUser,updateSection,deleteSection,updateItem,createItem,getItemsByUser,getItemsBySection, };