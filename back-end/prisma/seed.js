const bcrypt = require('bcryptjs')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const password = bcrypt.hashSync('123456')
const addressData = [
    {
        fname: "นันธวุฒิ",
        lname: "บุญเหลี่ยม",
        shipping_address: "ไม่ระบุ",
        district: "เมืองหงส์",
        prefecture: "จตุรพักตรพิมาน",
        province: "ร้อยเอ็ด",
        zip_code: "45180",
        phone: "08888888",
        userId: 1,
      }
        
]



const run = async () => {
  await prisma.shippingInformation.createMany({
    data : addressData
  })
}

run()