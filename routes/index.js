const express = require('express');
const router = express.Router();

const accountRouter = require('./account');
const feedRouter = require('./feed');
const historyRouter = require('./history');
const loginRouter = require('./login');
const productRouter = require('./product');
const userRouter = require('./user');

//테스트용 코드. 테스트 이후 삭제
const forMethodTestRouter = require('./forMethodTest');

router.use('/forMethodTest', forMethodTestRouter)
router.use('/account',accountRouter);
router.use('/feed',feedRouter);
router.use('/history',historyRouter);
router.use('/login',loginRouter);
router.use('/procutRouter',productRouter);
router.use('/userRouter',userRouter);


router.get('/', async (req, res) => {

    const params = [req.query.name, req.query.id];
    console.log(params);
    res.send("Hello World!");
})


module.exports = router;