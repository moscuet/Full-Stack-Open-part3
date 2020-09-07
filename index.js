const express = require('express');
const app =express();
app.use(express.json());
const morgan = require('morgan');
let persons = require('./data/persons');
const PORT = 3001;

morgan.token('host', function(req, res) {
  return req.hostname;
});
morgan.token('body', function(req, res) {
 return  Object.keys(req.body).length>0? JSON.stringify(req.body): null;
});
app.use(morgan(':method :host :status :res[content-length] - :response-time ms :body ')); 
const createId = () => Math.floor(Math.random()*10000000);
const checkDuplicate = name => persons.find( p => p.name===name);

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  let count = persons.reduce((accu,curr)=> accu+1,0);
  let time =  new Date();
  let html = `<div> <p>phone book has infor for ${count} people</p><p> ${time}</p> </div>`
  res.end(`${html}`);
});

app.get('/api/persons/:id', (req, res) => {
  let id = Number(req.params.id)
  let person = persons.find ( p => p.id===id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body
 if (!body.name||!body.number) {
  return res.status(206).json({ error: 'incomplete input' })
 }
  if(!checkDuplicate(body.name)){
    const person = {
      name: body.name,
      number: body.number,
      id: createId(),
    }
    persons = persons.concat(person);
    res.json(persons);
  }
  else  {
    return res.status(209).json({ error: 'name must be unique' });
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  let person = persons.find ( p => p.id===id);
  if(person){
    persons = persons.filter( p => p.id!==id);
    res.status(204).end();
  }
  else{
    res.status(404).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
