
const create = (req,res) =>{
    res.json({
        message: 'API is create'
    })
}

const getone = (req,res) => {
    res.json({
        message: 'API is getone'
    })
}

const getall = (req,res) => {
    res.json({
        message: 'API is getall'
    })
}
const update = (req,res) => {
    res.json({
        message: 'API is update'
    })
}

const remove = (req,res) => {
    res.json({
        message: 'API is remove'
    })
}

module.exports ={
    create,
    getone,
    getall,
    update,
    remove,
 
}