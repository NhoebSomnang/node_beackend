
const create = (req,res) =>{
    res.send("Hello from customer");
}

const getone = (req,res) =>{
    res.send("Hello from Getone Data");
}

const getall = (req,res) =>{
    res.send("Hello from Getall Data");
}

const update = (req,res) =>{
    res.send("Hello from update Data");
}

const remove = (req,res) =>{
    res.send("Hello from remove Data");
}

module.exports={
    create,
    getone,
    getall,
    update,
    remove,
}