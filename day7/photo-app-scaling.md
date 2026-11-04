# SnapShare — Scaling Plan

A scaling plan for SnapShare, a photo-sharing app where users upload
photos and scroll a feed of photos from people they follow.

---

## 1. Assumptions and daily active users

**Starting facts:**
- 10,000,000 registered users.
- 10% are active each day.
- Each active user uploads 1 photo per day and views 50 feed pages per day.
- Average photo size: 2 MB.
- Average thumbnail size: 50 KB.

**Daily active users (DAU):**

**Additional assumptions I'm making:**
- Peak traffic is **5× the daily average** (evening burst when most users scroll).
- Photos are kept forever (no deletion assumed).
- Each feed page shows about 10 photos.
- Traffic is spread roughly evenly over 24 hours for the *average* figure.

---

## 2. Estimates

### Uploads per second

### Feed views per second

Each feed page loads ~10 photos, so:

### Photo storage per year

---

## 3. Read-heavy or write-heavy?

**The system is strongly read-heavy.**

Feed views run at about **579/s average (2,894/s peak)** while uploads
run at **11.6/s average (58/s peak)** — roughly **50× more reads than
writes** from the feed alone, and **~500 photo reads per upload** once
you count the 10 photos per feed page.

**What this means for the design:**
- Reads must be cheap and fast → use a **CDN** for photo files, a
  **cache** for hot feed data, and **read replicas** for database
  queries.
- Writes can stay simple → a single primary database can absorb
  ~58 writes/s comfortably, and slow work like thumbnail generation
  is pushed to a **background queue and worker** so the upload
  response returns immediately.
- Photo files are read far more often than they're written, so they
  belong in **object storage behind a CDN**, not in the database.

---

## 4. Why photos don't belong in the database

Photos should **not** be stored as BLOBs inside the relational
database. The reasons:

- **Size:** at 2 MB per photo and 2 TB added every day, the database
  would grow to hundreds of TB in a year — far beyond what a
  relational database handles well.
- **Backups and replication:** replicating multi-TB blobs to a read
  replica would be slow and expensive, and would compete with the
  small, hot rows (users, follows, photo metadata) that replicas
  exist to serve quickly.
- **Cost:** object storage is roughly 10–20× cheaper per GB than
  database storage.
- **Delivery:** a database can't serve photos from edge locations; a
  CDN can. Putting files in object storage lets the CDN cache them at
  the edge, which is essential at ~5,790 photo requests/s.

**Where they should go:** the raw photo files and thumbnails go into
**object storage** (e.g. S3 or GCS). The database stores only a
**small row of metadata** per photo — ID, owner, storage key, size,
category, upload time, thumbnail key — plus the URL the CDN serves.

---

## 5. Architecture (text diagram)

```text
                            ┌────────────────┐
                            │    Clients     │
                            │ (mobile / web) │
                            └───────┬────────┘
                                    │
                                    ▼
                            ┌────────────────┐
                            │      CDN       │◄── serves photos and
                            └───────┬────────┘    thumbnails at the edge
                                    │ (cache miss)
                                    ▼
                            ┌────────────────┐
                            │ Load Balancer  │
                            └───────┬────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
        ┌───────────┐         ┌───────────┐         ┌───────────┐
        │ App srv 1 │         │ App srv 2 │         │ App srv 3 │
        └─────┬─────┘         └─────┬─────┘         └─────┬─────┘
              │                     │                     │
              └─────────┬───────────┴───────────┬─────────┘
                        ▼                       ▼
                 ┌────────────┐          ┌──────────────┐
                 │   Cache    │          │  Database    │
                 │  (Redis)   │          │  (primary)   │
                 └────────────┘          └──────┬───────┘
                                                │ replication
                                                ▼
                                         ┌──────────────┐
                                         │ Read Replica │
                                         └──────────────┘

              ┌────────────┐          ┌──────────────┐
              │   Queue    │◄─────────│Object Storage│
              │ (messages) │          │ (photo files)│
              └──────┬─────┘          └──────┬───────┘
                     ▼                       ▲
              ┌────────────┐                 │
              │   Worker   │─────────────────┘
              │(thumbnails)│  writes thumbnails
              └────────────┘  back to storage