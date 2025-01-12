const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const flights = {}; // { flightNumber: { seats: [...], passengers: [...] } }
const seatCapacity = 10;

const assignSeat = (seats) => {
  for (let i = 1; i <= seatCapacity; i++) {
    if (!seats.includes(i)) return i;
  }
  return null; // No seats available
};

// API to book a flight ticket
app.post('/book', (req, res) => {
  const { name, email, destination, travelDate, flightNumber } = req.body;

  if (!name || !email || !destination || !travelDate || !flightNumber) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (!flights[flightNumber]) {
    flights[flightNumber] = { seats: [], passengers: [] };
  }

  const flight = flights[flightNumber];
  const seatNumber = assignSeat(flight.seats);

  if (!seatNumber) {
    return res.status(400).json({ error: 'No seats available on this flight.' });
  }

  flight.seats.push(seatNumber);
  flight.passengers.push({ name, email, destination, travelDate, seatNumber });

  res.status(201).json({
    message: 'Flight ticket booked successfully.',
    flightDetails: { flightNumber, destination, travelDate },
    seatNumber,
    passenger: { name, email },
  });
});

// API to view flight ticket details
app.get('/ticket', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  for (const flightNumber in flights) {
    const passenger = flights[flightNumber].passengers.find(
      (p) => p.email === email
    );
    if (passenger) {
      return res.status(200).json({
        flightNumber,
        destination: passenger.destination,
        travelDate: passenger.travelDate,
        seatNumber: passenger.seatNumber,
        passenger: { name: passenger.name, email: passenger.email },
      });
    }
  }

  res.status(404).json({ error: 'No ticket found for the given email.' });
});

// API to view all passengers on a specific flight
app.get('/passengers', (req, res) => {
  const { flightNumber } = req.query;

  if (!flightNumber || !flights[flightNumber]) {
    return res.status(404).json({ error: 'Flight not found.' });
  }

  const passengers = flights[flightNumber].passengers.map((p) => ({
    name: p.name,
    seatNumber: p.seatNumber,
  }));

  res.status(200).json({
    flightNumber,
    passengers,
  });
});

// API to cancel a flight ticket
app.delete('/cancel', (req, res) => {
  const { email, flightNumber } = req.body;

  if (!email || !flightNumber || !flights[flightNumber]) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const flight = flights[flightNumber];
  const passengerIndex = flight.passengers.findIndex((p) => p.email === email);

  if (passengerIndex === -1) {
    return res.status(404).json({ error: 'Passenger not found on this flight.' });
  }

  const seatNumber = flight.passengers[passengerIndex].seatNumber;
  flight.seats = flight.seats.filter((seat) => seat !== seatNumber);
  flight.passengers.splice(passengerIndex, 1);

  res.status(200).json({ message: 'Flight ticket cancelled successfully.' });
});

// API to modify seat assignment
app.put('/modify-seat', (req, res) => {
  const { email, flightNumber, newSeatNumber } = req.body;

  if (!email || !flightNumber || !newSeatNumber || !flights[flightNumber]) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const flight = flights[flightNumber];
  const passenger = flight.passengers.find((p) => p.email === email);

  if (!passenger) {
    return res.status(404).json({ error: 'Passenger not found on this flight.' });
  }

  if (flight.seats.includes(newSeatNumber)) {
    return res.status(400).json({ error: 'Seat already taken.' });
  }

  // Update seat assignment
  flight.seats = flight.seats.filter((seat) => seat !== passenger.seatNumber);
  flight.seats.push(newSeatNumber);
  passenger.seatNumber = newSeatNumber;

  res.status(200).json({
    message: 'Seat assignment updated successfully.',
    passenger,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Flight Booking System API running on http://localhost:${port}`);
});

module.exports = app;