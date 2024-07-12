import ConnectionPool from "../utils/db.mjs"
import { Router } from "express"
import { protect } from "../middlewares/protect.mjs";

const bookRouter=Router();

bookRouter.use(protect)

bookRouter.post("/create",async (req,res)=>{
    const create_book={
        ...req.body,
        created_at: new Date(),
    };
    try{
        await ConnectionPool.query(
          `insert into books (book_name,auth_name,published_year,publication_time,categoly,created_at)
          values ($1,$2,$3,$4,$5,$6)`,
          [
            create_book.book_name,
            create_book.auth_name,
            create_book.published_year,
            create_book.publication_time,
            create_book.categoly,
            create_book.created_at,
          ]
          
        );
        }
        catch{
          res.status(500).json({messeage:"Server could not create book because database not connection"});
          res.status(400).json({messeage:"Server could not create book there are missing data from client"});
        }

    return res.status(200).json({
        message : "User has been created successfully"
    });
})

bookRouter.put("/:BookId",async (req,res)=>{
    const update_book={
        ...req.body,
    }
    const { BookId }=req.params;
    try{await ConnectionPool.query(
        `update books set 
        book_name=coalesce($1,book_name),
        auth_name=coalesce($2,auth_name),
        published_year=coalesce($3,published_year),
        publication_time=coalesce($4,publication_time),
        categoly=coalesce($5,categoly)
        
        where book_id=$6`,
        [
            update_book.book_name,
            update_book.auth_name,
            update_book.published_year,
            update_book.publication_time,
            update_book.categoly,
            BookId,
        ]
    );}catch{
        res.status(500).json({messeage:"Server could not update book because database not connection"});
        res.status(400).json({messeage:"Server could not update book there are missing data from client"});
    }
    return res.status(200).json({
        message : `User has been update book ID ${BookId}successfully`
    });
})

bookRouter.delete("/:BookId",async (req,res)=>{
    const { BookId }=req.params;
    console.log(BookId)
    try{await ConnectionPool.query(
        `delete from books 
        where book_id=$1`,
        [
            BookId
        ]
    );}catch{
        res.status(500).json({messeage:"Server could not delete book because database not connection"});
        res.status(400).json({messeage:"Server could not delete book there are missing data from client"});
    }
    return res.json({
        message : "User has been delete successfully"
    });
})

bookRouter.post("/collection/:username",async (req,res)=>{
    const {username}=req.params;
    try{
        const bookcollection=await ConnectionPool.query(
            `select book_name from  users
            join booklist on users.user_id=booklist.user_id
            join books on booklist.book_id=books.book_id
            where username=$1`,
            [
                username
            ]
        );
        const booklist=bookcollection.rows
        const books=booklist.map((books)=>{const book=books.book_name;
            return book
        });
        return res.json({"collection":books})
    }
    catch{
        res.status(500).json({messeage:"Server could not search book because database not connection"});
        res.status(400).json({messeage:"Server could not search book there are missing data from client"});
    }
    
})

bookRouter.post("/add_collection/:username",async (req,res)=>{
    const add_collection_book={
        ...req.body,
        update_on: new Date(),
    }
    const {username}=req.params;
    try{
        const userId= await ConnectionPool.query(
            `SELECT user_id FROM users WHERE username = $1`,
            [
                username
            ]
        );
        const Id=userId.rows
        await ConnectionPool.query(
        `insert into booklist (user_id,book_id,update_on)
        values ($1,$2,$3)`,
        [
            Id[0].user_id,
            add_collection_book.book_id,
            add_collection_book.update_on
        ]
      );
    }
    catch{
        res.status(500).json({messeage:"Server could not search book because database not connection"});
        res.status(400).json({messeage:"Server could not search book there are missing data from client"});
    }

    return res.json({
        message : "User has been add collection successfully"
    });
})

export default bookRouter