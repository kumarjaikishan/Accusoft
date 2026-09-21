const ledmodel = require('../modals/ledger_schema')
const expense = require('../modals/exp_schema')
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/apierror');


const addledger = asyncHandler(async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.userid);
    const { ledger, budget = 0 } = req.body;

    if (!req.userid || !ledger) {
        throw new ApiError(400, "All Fields are Required");
    }

    const isExists = await ledmodel.findOne({ userid: req.userid, ledger }).lean();
    if (isExists) {
        throw new ApiError(400, `${req.body.ledger} Already Exist`);
    }

    const query = new ledmodel({ userid: req.userid, ledger, budget });
    const result = await query.save();

    return res.status(200).json({
        message: "Ledger Added "
    });
});

const updateledger = asyncHandler(async (req, res, next) => {
    const { ledger_id, newledger, newbudget } = req.body;
    const userId = req.userid;

    if (!ledger_id || !newledger) {
        throw new ApiError(400, "All Fields are Required");
    }

    // Check if another ledger (different _id) already has the same name
    const isExists = await ledmodel.findOne({
        userid: req.userid,
        ledger: newledger,
        _id: { $ne: ledger_id }   // exclude the current ledger
    }).lean();

    if (isExists) {
        throw new ApiError(421, `${newledger} Already Exists`);
    }

    const query = await ledmodel.findByIdAndUpdate(
        { _id: ledger_id , userid:userId},
        { ledger: newledger, budget: newbudget },
        { new: true } // return updated doc if needed
    );

    if (!query) {
        throw new ApiError(422, "Ledger Id not Valid");
    }

    return res.status(200).json({
        message: "Ledger Updated"
    });
});

const mergeledger = asyncHandler(async (req, res, next) => {
    const { ledger_id, newledger } = req.body;

    if (!ledger_id || !newledger) {
        throw new ApiError(400, "All Fields are Required");
    }

    const isExists = await ledmodel.findOne({ userid: req.userid, ledger: newledger });

    //If want to merge ledgers
    if (isExists) {
        const query = await expense.updateMany({ ledger: ledger_id }, { ledger: isExists._id });
        const query2 = await ledmodel.deleteOne({ _id: ledger_id });
        return res.status(200).json({
            message: "Ledger Merged"
        })
    }
})

const deleteledger = asyncHandler(async (req, res, next) => {
    // console.log(req.body.ledgerid);
    const { ledgerid } = req.body;
    const userId = req.userid;

    if (!ledgerid) {
        throw new ApiError(400, "Ledger Id Required");
    }
    const result = await ledmodel.findByIdAndDelete({ _id: ledgerid, userid:userId });
    const deleteexp = await expense.deleteMany({ ledger: ledgerid ,userid:userId})
    // console.log(result);
    if (!result) {
        throw new ApiError(400, "Id not Valid");
    }
    return res.status(200).json({
        message: "Ledger Deleted"
    })
})




module.exports = { addledger, deleteledger, updateledger, mergeledger };