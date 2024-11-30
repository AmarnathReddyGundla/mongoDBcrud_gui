const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const Brand=require('./models/Brand');

const app=express();
const port=3000;

//MongoDB connection

mongoose.connect('mongodb+srv://amarnath:amarvedha2@cluster0.6dac6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=> console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB',err));
    
//Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

//set EJS as the view engine
app.set('view engine','ejs');

//Routes
//home page -show all brands and form for  adding 2a new brand
app.get('/',async(req,res)=>{
    try{
        const brands=await Brand.find();
        res.render('index',{brands});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

// add brand
app.post('/add',async(req,res)=>{
    try{
        const newBrand=new Brand({
            name:req.body.name,
            description:req.body.description
        });
        await newBrand.save();
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('Error adding brand');
    }
});

//edit Brand page -- preopulate the form with the existing data
app.get('/edit/:id',async(req,res)=>{
    try{
        const brand=await Brand.findById(req.params.id);
        if(!brand) return res.status(404).send('Brand not found');
        res.render('edit',{brand});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

//update post
app.post('/edit/:id',async (req,res)=>{
    try{
        await Brand.findByIdAndUpdate(req.params.id,req.body);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('error updating brand');
    }
});

//delete brand
app.post('/delete/:id',async (req,res)=>{
    try{
        await Brand.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch(err){
        console.log(err);
        res.status(500).send('Error deleting brand');
    }
});



//start the server
app.listen(port,()=>{
    console.log('Server running at http://localhost:${PORT}');
});
