const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");


//สมัครสมาชิก
exports.register = async (req,res,next) => {
    const {firstname,lastname,username,password,phone,email,address,gender} = req.body;
    try{
        if (!(firstname && lastname && username && password && phone && email && address && gender )) {
            return next(new Error("กรอกข้อมูลไม่ถูกต้อง"));
          }
        const hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        const data = {
            firstname,
            lastname,
            username,
            password: hashedPassword,
            phone,
            email,
            address,
            gender
            
        };

        const rs = await db.user.create({data})
        console.log(rs);

        res.json({ msg: 'ลงทะเบียนสำเร็จ' })
    }catch (err) {
        next(err);
    }
}

// api login
exports.login = async (req, res, next) => {
    const{username, password} = req.body;
    try{
        if(!(username.trim() && password.trim())){
            throw new Error('ชื่อผู้ใช้หรือรหัสผ่านต้องไม่เว้นว่าง');
    }

    const user = await db.user.findFirstOrThrow({where : {username}});
    const pwOk = await bcrypt.compare(password, user.password)
    if(!pwOk) {
      throw new Error('invalid login')
    }
 
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '30d'
    })
    console.log(token)
    res.json({token : token})

}catch(err){
    next(err)
}

};

//api หน้าโปรไฟล์
exports.getme = (req,res,next) => {
    res.json(req.user)
  }