# Reflection

**The most difficult concept** in this course was transactionality — not
in the abstract, but in understanding *what actually guarantees
correctness* when two users race for the same resource. Early on I
assumed a cache or a waiting room was enough, because it *feels* like a
lock. The reading that fixed it for me was the ticketing example: the
cache only shows a copy, and the database is the source of truth. The
idea that a single `UPDATE ... WHERE status = 'available'` inside a
transaction is a *guarantee*, not an optimisation, changed how I think
about state. I overcame it by re-implementing the pattern myself in the
Day 6 SQLite work, then again in the QuickNotes capstone — running the
"two concurrent buyers" case by hand and watching one fail with 0 rows
affected made it click.

**I would improve** the API client half of my capstone. The demo worked
but I only tested the happy paths on my machine; I didn't test error
states (network down, 500 response, token expired) or long inputs
properly. Based on the feedback I received, I would add a dedicated
error-handling test pass, tighten the disabled-button behaviour during
in-flight requests, and add unit-style checks for the validation logic
so a bad request can't quietly slip through.

**Next, I want to learn** how to run real load tests — tools like k6
or Locust — so I can *measure* whether a design survives its estimated
traffic instead of trusting my arithmetic. I also want to learn how to
reason about distributed transactions beyond a single database (sagas,
idempotency keys, eventual consistency) because a real ticketing system
at scale would eventually need those patterns.