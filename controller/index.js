const app = require('express').Router();
const bookModel = require('./../model/book');
const {check, validationResult} = require('express-validator');
const prHlp = require('./../helpers/persian_date_helper');
app.get('/', async (req, res) => {
    let data=await getInitialData({},{_id: -1});
    res.render('index.ejs', {data});
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

app.get('/search/:param', async (req, res) => {
    let q = req.query.q;
    let field = req.params.param;
    let obj = {};
    obj[field] = {$regex: '.*' + q + '.*'};
    let data = await bookModel.find(obj).exec()
    data = data.map(item => {
        return {
            val: item[field],
            _id: item[field],
        }
    });
    res.send(data)
});
app.post('/filter',async (req, res) => {
    let body = req.body;
    let sortField='_id';
    let obj={};
    if(body.sorting==2) sortField='pages';
    let sorting={};
    sorting[sortField]=-1
    if(body.title)obj.title=body.title;
    if(body.author)obj.author=body.author;
    if(body.categories)obj.categories=body.categories;
    let data=await getInitialData(obj,sorting);
    res.send({
        status:200,
        data
    })
});
const getInitialData=(obj,sorting)=>{
  return new Promise(async (resolve, reject) => {
      let data = await bookModel.find(obj).sort(sorting).exec();
      let arr = [];
      for (let i in data) {
          arr.push({
              data: data[i],
              cr: prHlp.get_def_date(new Date(data[i].createdAt)),
              ct: data[i].categories.join(' , ')
          })
      }
      resolve(arr)
  })
};
module.exports = app;