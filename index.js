const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const path = require('path');


const prisma = new PrismaClient();
const app = express();

app.use(cors()); // Allow all origins

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the contact.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Website2022/contact.html'));
});

// Handle form submissions
app.post('/submit-form', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save the form data using Prisma
    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        message,
      },
    });

    res.send('Thank you for contacting us!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while submitting the form.');
  }
});

// Endpoint to handle newsletter subscription
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
      // Save the subscription email
      const newSubscription = await prisma.subscription.create({
          data: {
              email,
          },
      });
      res.send('Subscription successful!');
  } catch (error) {
      console.error('Error processing subscription:', error);
      if (error.code === 'P2002') { // Unique constraint failed
          res.status(409).send('This email is already subscribed.');
      } else {
          res.status(500).send('An error occurred while subscribing.');
      }
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
