require("./instrument.js");
require('dotenv').config();

const email= require ( '@sendgrid/mail' ); 
const Sentry = require("@sentry/node");
const express = require('express')
const cors = require('cors')
 email. setApiKey (process. env . SENDGRID_API_KEY); 

const { PrismaClient } = require('./src/generated/prisma');
const { RENT_CONFIRMATION_TEMPLATE } = require("./utils/constantes.js");
const prisma = new PrismaClient()
const app = express()


const port = 3001

 


app.use(cors())
app.use(express.json());



let cars = []




app.get('/cars', async (req, res) => {
    //   ira retornar uma lista de carros com status 200

   const allCars = await prisma.car.findMany()

    res.status(200).json(allCars)
})



app.post('/cars', async (req, res) => {
    console.log(req.body)
    const car = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        category: req.body.category,
        transmission: req.body.transmission,
        fuel: req.body.fuel,
        seats: req.body.seats,
        available: req.body.available
    }

    const newCar = await prisma.car.create({
        data: car
    })

    res.status(201).json(newCar)
})

app.delete('/cars/:id', async (req, res) => {
   try{
       const { id } = req.params

    await prisma.car.delete({
        where: { id }
    })

   }catch (error) {
       console.error(error)
       res.status(404).json({ error: 'Car not found' })
   }
    res.status(204).send()  
}) 


app.put('/cars/:id', async (req, res) => {
    try {
        const updatedCar = await prisma.car.update({
            where: {
                id: req.params.id
            },
            data: {
                name: req.body.name,
                category: req.body.category,
                seats: req.body.seats,
                price: req.body.price,
                transmission: req.body.transmission,
                fuel: req.body.fuel,
                image: req.body.image,
                available: req.body.available,
            }
        })

      

        res.status(200).json(updatedCar)
    } catch (error) {
        console.error(error)   


        res.status(404).json({ error: 'Car not found' })
    }
})


app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.get('/email', async (req, res) => {
    try {
        await email.send({
            to: 'yukaspinheirogomes@gmail.com',
            from:'yukaspinheirogomes@gmail.com',
            subject: 'Test Email',
            html: RENT_CONFIRMATION_TEMPLATE
        });
        res.status(200).json({ message: 'Email enviado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Falha ao enviar email' });
    }  
})

Sentry.setupExpressErrorHandler(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})





