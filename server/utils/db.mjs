import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:postgres@localhost:5432/book-collection",
});

export default connectionPool;