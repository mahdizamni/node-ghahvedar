const app = require('express').Router();
const bookModel = require('./../model/book');
const {check, validationResult} = require('express-validator');
const prHlp = require('./../helpers/persian_date_helper');
app.get('/', async (req, res) => {
    let data = await bookModel.find({}).sort({_id: -1}).exec();
    let arr = [];
    for (let i in data) {
        arr.push({
            data: data[i],
            cr: prHlp.get_def_date(new Date(data[i].createdAt)),
            ct:data[i].categories.join(' , ')
        })
    }
    res.render('index.ejs', {data: arr});
});
app.route('/add')
    .get((req, res) => {
        res.render('add.ejs');
    })
    .post([
        check('title').not().isEmpty().withMessage('نام کتاب را وارد کنید'),
        check('author').not().isEmpty().withMessage('نام نویسنده را وارد کنید'),
        check('pages').not().isEmpty().withMessage('تعداد صفحات را وارد کنید'),
        check('summary').not().isEmpty().withMessage('توضیحات را وارد کنید'),
        check('pages').isInt().withMessage("تعداد صفحات را به صورت عددی وارد کنید"),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send({
                description: errors.array()[0].msg,
                status: 401
            });
        }
        let body = req.body;
        if (!req.body.categories.length) return res.send({
            status: 401,
            description: "دسته بندی را وارد کنید"
        });
        let data = await bookModel.findOne({title: body.title}).exec();
        if (data) return res.send({
            status: 401,
            description: "نام کتاب نمیتواند تکراری باشد"
        });
        let a = new bookModel({
            title: body.title,
            author: body.author,
            pages: body.pages,
            categories: body.categories,
            summary: body.summary,
            createdAt: new Date().getTime()
        }).save((e, d) => {
            if (e) return res.send({
                status: 500,
                description: 'خطا در ثبت اطلاعات'
            });
            res.send({
                status: 200
            })
        })

    });

app.get('/search/:param',async (req,res)=>{
   let q=req.query.q;
   let field=req.params.param;
   let obj={};
   obj[field]={ $regex: '.*' + q + '.*' };
   let data=await bookModel.find(obj).exec()
    data=data.map(item=>{
       return {
           val:item[field],
           _id:item._id,
       }
    });
    res.send(data)

});
module.exports = app;