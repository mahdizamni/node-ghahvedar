const jalaali = require('jalaali-js');
let now=new Date();
let now_year=now.getFullYear();
let now_month=now.getMonth()+1;
let now_day=now.getDate();
let jalali_date=jalaali.toJalaali(now_year,now_month,now_day);
const get_year_now=()=>{
    return jalali_date.jy;
};
const get_month_now=()=>{
    return jalali_date.jm;
};
const get_day_now=()=>{
    return jalali_date.jd;
};
const get_full_date_now=(slash=false)=>{
    let between='-';
    if(slash) between='/';
    return jalali_date.jy+between+jalali_date.jm+between+jalali_date.jd;
};
const get_default_date=(date,slash=false)=>{
    let between='-';
    if(slash) between='/';
    // d = default
    let d_date=new Date(date);
    let d_y=d_date.getFullYear();
    let d_m=d_date.getMonth()+1;
    let d_d=d_date.getDate();
    let d_j_date=jalaali.toJalaali(d_y,d_m,d_d);
    return d_j_date.jy+between+d_j_date.jm+between+d_j_date.jd;
};
const get_time=()=>{
 return now.getHours()+' : '+now.getMinutes()+' : '+now.getSeconds()
};
module.exports.get_time=get_time;
module.exports.get_day=get_day_now;
module.exports.get_month=get_month_now;
module.exports.get_year=get_year_now;
module.exports.get_full_date_now=get_full_date_now;
module.exports.get_def_date=get_default_date;
