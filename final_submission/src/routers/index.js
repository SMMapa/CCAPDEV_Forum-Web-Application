import { Router } from "express";
import registerRouter from './register.js';
import postRouter from './posts.js';
import searchRouter from './search.js';
import editProfileRouter from './edit_profile.js';
import uploadRouter from './file_upload.js';
import loginRouter from './login.js';
import editPostRouter from './edit_post.js';
import resetRouter from "./reset_password.js";
import managerRouter from "./manager.js";
import adminManagerRouter from "./adminManager.js";
import adminRouter from "./admin.js";
const router = Router();

router.use(registerRouter);
router.use(postRouter);
router.use(searchRouter);
router.use(editProfileRouter);
router.use(uploadRouter);
router.use(loginRouter);
router.use(editPostRouter);
router.use(resetRouter);
//router.use(managerRouter);
router.use(adminManagerRouter);
router.use(adminRouter);

router.get('/', function(_req,res) {
    res.redirect('/home');
});

router.get('/error', function(req,res) {
    res.render('error');
})

export default router;