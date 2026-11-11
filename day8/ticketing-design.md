# TicketHub — System Design

A design for TicketHub, a website that sells tickets for concerts and
events. This follows the six-part system design framework:
requirements, estimates, API, data model, architecture, and trade-offs.

---

## 1. Requirements

### Functional requirements

- Users can browse a list of events and view an event's details.
- Users can view the seat map for an event and see which seats are
  available, held, or sold.
- Users can **hold** a seat for a limited time (e.g. 10 minutes) while
  they complete checkout.
- Users can pay for their held seats and receive a confirmation.
- Users can view their past and upcoming orders (their tickets).
- Users can sign up, log in, and log out.
- An admin can create an event and define its seats.

### Non-functional requirements

- **Speed:** event pages load in under 500 ms at p95; the seat map
  loads in under 1 second even during a big sale.
- **Correctness:** a seat can never be sold twice. This is the single
  most important requirement.
- **Fairness:** during a big sale, one user cannot buy all 20,000
  seats; each user has a per-event purchase limit (e.g. 4 seats).
- **Fairness (access):** the system must not crash under a 200,000-user
  spike; a virtual waiting room gives everyone a fair chance.
- **Availability:** 99.9% uptime, except during planned maintenance.
- **Durability:** a paid order must never be lost.
- **Security:** HTTPS only; payment data is never stored on our servers.

---

## 2. Estimates

**Starting facts:**
- 2,000,000 registered users.
- 50,000 visitors on a normal day, each viewing 10 pages.
- 5,000 tickets sold on a normal day.
- Big sale: 200,000 people try to buy 20,000 seats in 10 minutes.

### Normal traffic
