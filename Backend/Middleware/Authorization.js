const authorize = (permittedRole)=>{
    return (req, res, next)=>{
        console.log(req.user)
        if(permittedRole.includes(req.user.role)){
            next()
        }else{
            res.send('Not Authorized')
        }
    

    }
}

module.exports = {authorize}