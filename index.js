const express = require('express')
const app = express()
const port = 3002

let cars = []


app.get('/cars', (req, res) => {
    //   ira retornar uma lista de carros com status 200

    res.status(200).json(cars)
})

app.post('/cars', (req, res) => {
    const car = {
        name: "Song Plus",
        category: "SUV",
        seat: 5,
        price: 250000,
        transmission: "automatic",
        fuel: "electric",
        imageUrl: "",
        description: "Um carro eletrico moderno e espaçoso.",
        features: ["eletrico"]
    }

    //   ira adicionar um carro com status 201
    cars.push(car)
    res.status(201).json(car)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
