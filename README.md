## Frontend Setup

### Prerequisites

- Node.js 20.x recommended
- Local backend running on `http://localhost:7272`
- Backend configured with `DATABASE_URL` for PostgreSQL

For the full PostgreSQL setup, database creation, and troubleshooting guide, see [backend/README.md](/Users/kot/projects/blog-app-mui/backend/README.md).

### Install

Using Yarn:

```sh
yarn install
```

Using npm:

```sh
npm install
```

### Environment

Create your frontend env from `.env.example` and point it to the local backend:

```sh
cp .env.example .env
```

Default values:

- `NEXT_PUBLIC_SERVER_URL=http://localhost:7272`
- `NEXT_PUBLIC_ASSET_URL=http://localhost:7272`

### Run Locally

1. Start the backend first.
2. Make sure the backend has a valid `DATABASE_URL` for PostgreSQL.
3. Start the frontend.

Using Yarn:

```sh
yarn dev
```

Using npm:

```sh
npm run dev
```

### Local Full Flow

The frontend no longer expects the old Minimals demo/mock API flow.
It now works against your local backend API, and that backend is responsible for connecting to PostgreSQL through `DATABASE_URL`.

### Notes

- File assets are served from the backend API via `NEXT_PUBLIC_ASSET_URL`.
- If auth, posts, or uploads fail locally, first verify that the backend is running and its PostgreSQL connection is valid.
