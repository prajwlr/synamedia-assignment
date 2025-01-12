This is a simple Node.js project that implements a Flight Booking System. It allows users to book flights, view their tickets, and manage their seat preferences.

- Book flight tickets with personal details.
- View ticket details using email.
- See all passengers for a specific flight.
- Cancel bookings.
- Change seat assignments.

How to Use :

1. npm install

2. npm run dev

The API will run on `http://localhost:3000`.

Endpoints :

Book Ticket :
- POST /book
- Body example:
  {
    "name": "John",
    "email": "john@example.com",
    "destination": "NYC",
    "travelDate": "2025-01-20",
    "flightNumber": "FL123"
  }

View Ticket
- GET /ticket
- Query: `?email=john@example.com`

All Passengers
- GET /passengers
- Query: `?flightNumber=FL123`

Cancel Ticket
- DELETE /cancel
- Body example:
  {
    "email": "john@example.com",
    "flightNumber": "FL123"
  }

Modify Seat
- PUT /modify-seat
- Body example:
  {
    "email": "john@example.com",
    "flightNumber": "FL123",
    "newSeatNumber": 5
  }