const express = require('express');
const app = express();
const router = express.Router();
const login = require("../controller/login_contoroller");
const expense = require("../controller/exp_controller");
const ledger = require("../controller/ledger_controller");
const admin = require("../controller/admin_controller");
const slow = require("../controller/slow_controller");
const contact = require("../controller/contact_controller");
const vault = require("../controller/vault_controller");
const deploy = require("../controller/deploy_controller");
const authmiddlewre = require('../middleware/auth_middleware');
const { authorizationMiddleware } = require('../middleware/admin_middleware');
const upload = require('../middleware/multer_middleware');
const emailauth = require('../middleware/email_auth');
const { createCategory, getCategories, updateCategory, deleteCategory, createSection, getSectionsByCategory, getSectionsByUser, updateSection, deleteSection, createItem, getItemsBySection, getItemsByUser, updateItem, deleteItem } = require('../controller/notes_controller');

app.get('/', (req, res) => {
  res.status(200).send("This is From Expense Manager Backend, Created by Jai kishan");
});

router.route('/jwtcheck').get(authmiddlewre, (req, res) => {
  res.status(201).json({
    message: "ok"
  });
});

router.route('/signup').post(login.signup, emailauth);
router.route('/login').post(emailauth, login.login);
router.route('/verify').get(login.verify);
router.route('/setpassword').post(login.setpassword);
router.route('/refresh').post(login.refreshToken);
router.route('/logout').post(login.logout);
router.route('/passreset').get(authmiddlewre, authorizationMiddleware(['user', 'admin']), login.passreset);
router.route('/checkmail').post(login.checkmail);
router.route('/photo').post(authmiddlewre, upload.single('image'), login.photo);
router.route('/updateuserdetail').post(authmiddlewre, login.updateuserdetail);

router.route('/test').get(expense.allexpe);
router.route('/expdetail').post(authmiddlewre, expense.expdetail);
router.route('/explist').get(authmiddlewre, expense.explist);
router.route('/ledgersummary').get(authmiddlewre, expense.ledgerSummary);
router.route('/homesummary').get(authmiddlewre, expense.homeSummary);
router.route('/explistrange').get(authmiddlewre, expense.explistRange);
router.route('/ledgerdetail').get(authmiddlewre, expense.ledgerDetailList);
router.route('/addexpense').post(authmiddlewre, expense.addexpense);
router.route('/updateexp').post(authmiddlewre, authorizationMiddleware(['user', 'admin']), expense.updateexp);
router.route('/deleteExpense').post(authmiddlewre, authorizationMiddleware(['user', 'admin']), expense.delmany);
router.route('/userdata').get(authmiddlewre, expense.userdata);
router.route('/userledger').post(authmiddlewre, expense.userledger);

router.route('/addledger').post(authmiddlewre, ledger.addledger);
router.route('/updateledger').post(authmiddlewre, authorizationMiddleware(['user', 'admin']), ledger.updateledger);
router.route('/mergeledger').post(authmiddlewre, authorizationMiddleware(['user', 'admin']), ledger.mergeledger);
router.route('/deleteledger').post(authmiddlewre, authorizationMiddleware(['user', 'admin']), ledger.deleteledger);

/* 📨 CONTACT INQUIRIES ROUTES */
router.route('/contact').post(contact.submitContact); // Public submission
router.route('/admin/contacts').get(authmiddlewre, authorizationMiddleware(['admin']), contact.getAllContacts); // Admin view all
router.route('/admin/contacts/:id').put(authmiddlewre, authorizationMiddleware(['admin']), contact.updateContactStatus); // Admin update status
router.route('/admin/contacts/:id').delete(authmiddlewre, authorizationMiddleware(['admin']), contact.deleteContact); // Admin delete

/* 🛡️ ADMIN ROUTES */
router.route('/admindash').get(authmiddlewre, authorizationMiddleware(['admin']), admin.admindash);
router.route('/adminexp').get(authmiddlewre, authorizationMiddleware(['admin']), admin.allexpense);
router.route('/adminuser').get(authmiddlewre, authorizationMiddleware(['admin']), admin.alluser);
router.route('/adminuserupdate').post(authmiddlewre, authorizationMiddleware(['admin']), admin.userupdate);
router.route('/removeuser').post(authmiddlewre, authorizationMiddleware(['admin']), admin.removeuser);
router.route('/deletemanyexp').post(authmiddlewre, authorizationMiddleware(['admin']), expense.Admindelmany);
router.route('/adminupdateexp').post(authmiddlewre, authorizationMiddleware(['admin']), expense.Asminupdateexp);

router.route('/slow').post(authmiddlewre, authorizationMiddleware(['admin']), slow.slow);
router.route('/stillslow').post(authmiddlewre, authorizationMiddleware(['admin']), slow.stillslow);

/* 🚀 SERVER DEPLOYMENT (ORACLE VPS /home/ubuntu/scripts/<project>.sh) */
router.route('/admin/deploy').post(authmiddlewre, authorizationMiddleware(['admin']), deploy.triggerDeploy);
router.route('/admin/deploy/:project').all(authmiddlewre, authorizationMiddleware(['admin']), deploy.triggerDeploy);
router.route('/deploy/:project').all(authmiddlewre, authorizationMiddleware(['admin']), deploy.triggerDeploy);
/* CATEGORY ROUTES */
router.route("/category").post(authmiddlewre, authorizationMiddleware(["admin"]), createCategory);
router.route("/category").get(getCategories);
router.route("/category/:id").put(authmiddlewre, authorizationMiddleware(["admin"]), updateCategory).delete(authmiddlewre, authorizationMiddleware(["admin"]), deleteCategory);

/* SECTION ROUTES */
router.route("/section").post(authmiddlewre, authorizationMiddleware(["admin"]), createSection);
router.route("/section/:id").put(authmiddlewre, authorizationMiddleware(["admin"]), updateSection).delete(authmiddlewre, authorizationMiddleware(["admin"]), deleteSection);

/* 🔒 ZERO-KNOWLEDGE ENCRYPTED CREDENTIAL VAULT (ADMIN ONLY) */
router.route('/admin/vault/meta').get(authmiddlewre, authorizationMiddleware(['admin']), vault.getVaultMeta);
router.route('/admin/vault/init').post(authmiddlewre, authorizationMiddleware(['admin']), vault.initVault);
router.route('/admin/vault/items').get(authmiddlewre, authorizationMiddleware(['admin']), vault.getVaultItems);
router.route('/admin/vault/item').post(authmiddlewre, authorizationMiddleware(['admin']), vault.createVaultItem);
router.route('/admin/vault/item/:id')
    .put(authmiddlewre, authorizationMiddleware(['admin']), vault.updateVaultItem)
    .delete(authmiddlewre, authorizationMiddleware(['admin']), vault.deleteVaultItem);

module.exports = router;