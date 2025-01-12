const request = require('supertest');
const app = require('../server');

describe('Flight Booking System API', () => {
  const flightNumber = 'FL123';
  const samplePassenger = {
    name: 'John Doe',
    email: 'john@example.com',
    destination: 'NYC',
    travelDate: '2025-01-20',
    flightNumber,
  };

  it('should book a flight ticket successfully', async () => {
    const response = await request(app).post('/book').send(samplePassenger);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Flight ticket booked successfully.');
    expect(response.body.passenger.email).toBe(samplePassenger.email);
  });

  it('should retrieve ticket details for a passenger', async () => {
    const response = await request(app).get(`/ticket?email=${samplePassenger.email}`);
    expect(response.status).toBe(200);
    expect(response.body.passenger.email).toBe(samplePassenger.email);
    expect(response.body.flightNumber).toBe(flightNumber);
  });

  it('should return a list of all passengers on a flight', async () => {
    const response = await request(app).get(`/passengers?flightNumber=${flightNumber}`);
    expect(response.status).toBe(200);
    expect(response.body.flightNumber).toBe(flightNumber);
    expect(response.body.passengers).toHaveLength(1);
  });

  it('should cancel a flight ticket', async () => {
    const response = await request(app).delete('/cancel').send({
      email: samplePassenger.email,
      flightNumber,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Flight ticket cancelled successfully.');
  });

  it('should modify seat assignment successfully', async () => {
    const newSeatNumber = 5;
    await request(app).post('/book').send(samplePassenger); // Re-book to test seat change
    const response = await request(app).put('/modify-seat').send({
      email: samplePassenger.email,
      flightNumber,
      newSeatNumber,
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Seat assignment updated successfully.');
    expect(response.body.passenger.seatNumber).toBe(newSeatNumber);
  });
});
