import bcrypt from 'bcryptjs'
const users = [
    {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'Yaniv Kabariti',
        email: 'kabariti2@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Naor Aharoni',
        email: 'naorfm0@gmail.com',
        password: bcrypt.hashSync('123456', 10)
    },
]
export default users