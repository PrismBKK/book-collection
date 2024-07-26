import connectionPool from "../utils/db.mjs";
import { Router } from "express";
import { protect } from "../middlewares/protect.mjs";

const bookRouter = Router();

bookRouter.use(protect);

bookRouter.post("/create", async (req, res) => {
  const createBook = {
    ...req.body,
    created_at: new Date(),
  };
  try {
    await connectionPool.query(
      `insert into books (book_name,auth_name,published_year,publication_time,categoly,created_at)
          values ($1,$2,$3,$4,$5,$6)`,
      [
        createBook.book_name,
        createBook.auth_name,
        createBook.published_year,
        createBook.publication_time,
        createBook.categoly,
        createBook.created_at,
      ]
    );
  } catch {
    res.status(500).json({
      messeage: "Server could not create book because database not connection",
    });
    res.status(400).json({
      messeage:
        "Server could not create book there are missing data from client",
    });
  }

  return res.status(200).json({
    message: "User has been created successfully",
  });
});

bookRouter.put("/:bookId", async (req, res) => {
  const updateBook = {
    ...req.body,
  };
  const { bookId } = req.params;
  try {
    await connectionPool.query(
      `update books set 
        book_name=coalesce($1,book_name),
        auth_name=coalesce($2,auth_name),
        published_year=coalesce($3,published_year),
        publication_time=coalesce($4,publication_time),
        categoly=coalesce($5,categoly)
        
        where book_id=$6`,
      [
        updateBook.book_name,
        updateBook.auth_name,
        updateBook.published_year,
        updateBook.publication_time,
        updateBook.categoly,
        bookId,
      ]
    );
  } catch {
    res.status(500).json({
      messeage: "Server could not update book because database not connection",
    });
    res.status(400).json({
      messeage:
        "Server could not update book there are missing data from client",
    });
  }
  return res.status(200).json({
    message: `User has been update book ID ${BookId}successfully`,
  });
});

bookRouter.delete("/:bookId", async (req, res) => {
  const { bookId } = req.params;
  console.log(bookId);
  try {
    await connectionPool.query(
      `delete from books 
        where book_id=$1`,
      [bookId]
    );
  } catch {
    res.status(500).json({
      messeage: "Server could not delete book because database not connection",
    });
    res.status(400).json({
      messeage:
        "Server could not delete book there are missing data from client",
    });
  }
  return res.json({
    message: "User has been delete successfully",
  });
});

bookRouter.get("/collection/:username", async (req, res) => {
  const { userName } = req.params;
  try {
    const bookcollection = await connectionPool.query(
      `select book_name from  users
            join booklist on users.user_id=booklist.user_id
            join books on booklist.book_id=books.book_id
            where username=$1`,
      [userName]
    );
    const bookList = bookcollection.rows;
    const books = bookList.map((books) => {
      const book = books.book_name;
      return book;
    });
    return res.json({ collection: books });
  } catch {
    res.status(500).json({
      messeage:
        "Server could not call book collection  because database not connection",
    });
    res.status(400).json({
      messeage:
        "Server could not call book collection there are missing data from client",
    });
  }
});

bookRouter.post("/add_collection/:username", async (req, res) => {
  const addCollectionBook = {
    ...req.body,
    update_on: new Date(),
  };
  const { userName } = req.params;
  try {
    const userId = await connectionPool.query(
      `SELECT user_id FROM users WHERE username = $1`,
      [userName]
    );
    const userIndex = userId.rows;
    await connectionPool.query(
      `insert into booklist (user_id,book_id,update_on)
        values ($1,$2,$3)`,
      [
        userIndex[0].user_id,
        addCollectionBook.book_id,
        addCollectionBook.update_on,
      ]
    );
  } catch {
    res.status(500).json({
      messeage:
        "Server could not add book to collection because database not connection",
    });
    res.status(400).json({
      messeage:
        "Server could not add book to collection there are missing data from client",
    });
  }

  return res.json({
    message: "User has been add collection successfully",
  });
});

export default bookRouter;
