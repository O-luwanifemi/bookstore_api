import client from "../database/index.js";

export const add_book = async (req, res) => {
  try {
    let { title, author, published } = req.body;

    if([ title, author, published ].every(Boolean)) {

      // CAPITALISING AUTHOR NAMES
      const modified_name = author.split(" ").map(name => {
        const first_char = name.charAt(0).toUpperCase();
        return (first_char + name.slice(1).toLowerCase());
      })
                                                  
      author = modified_name.join(" ");

      await client.query(
        'INSERT INTO books (title, author, published) VALUES ($1, $2, $3) RETURNING *',
        [ title.toLowerCase(), author, +published ]
      );

      return res.status(200).json({ status: 'Success', message: 'Book added to inventory successfully!' });
    }

    return res.status(400).json({ status: 'Failed', message: `Sorry! Please, all panes are required.` });
  } catch (error) {
    res.status(400).json({ status: 'Failed', message: `Oops! ${error}` });
  }
}

export const get_all = async (req, res) => {
  try {
    const response = await client.query('SELECT * FROM books ORDER BY id ASC');
    if(response === undefined) {
      return res.status(500).json({ status: 'Failed', message: 'Server error!' });
    } else if(response.rows.length <= 0) {
      return res.status(200).json({ status: 'Success', message: 'Inventory is empty! Go here http://localhost:2222/books/add to add book(s).' })
    }

    res.status(200).json({ status: 'Success', books: response.rows });
  } catch (error) {
    console.log(`Oops! ${error}`);
  }
}

export const modify_book = async (req, res) => {
  const { id } = req.params;

  try {
    const book_with_id = await client.query('SELECT * FROM books WHERE id = $1', [ +id ]),
          [ book_row ] = book_with_id.rows;
    let { title, author, published } = req.body;

    if(book_row) {
      if([ title, author, published ].some(Boolean)) {
        const { title: old_book_title, author: old_book_author, published: old_book_year } = book_row;
        
        if(author) {
          // CAPITALISING AUTHOR NAMES
          const modified_name = author.split(" ").map(name => {
            const first_char = name.charAt(0).toUpperCase();
            return (first_char + name.slice(1).toLowerCase());
          })
                                                      
          author = modified_name.join(" ");

          await client.query(
            'UPDATE books SET (title, author, published) = ($1, $2, $3) WHERE id = $4', 
            [
              title ? title.toLowerCase() : old_book_title,
              author ? author : old_book_author,
              published ? +published : old_book_year,
              id
            ]
          )
          return res.status(200).json({ status: 'Success', message: `Book detail(s) modified successfully!` });
        }

        await client.query(
          'UPDATE books SET (title, author, published) = ($1, $2, $3) WHERE id = $4', 
          [
            title ? title.toLowerCase() : old_book_title,
            author ? author : old_book_author,
            published ? +published : old_book_year,
            id
          ]
        )
        return res.status(200).json({ status: 'Success', message: `Book detail(s) modified successfully!` });
      }
      return res.status(400).json({ status: 'Failed', message: `ERROR! Please submit book parameter(s) to update.` });
    }
    res.status(404).json({ status: 'Failed', message: `Oops! No book with id ${id} found.` });
  } catch (error) {
    console.log(error);
  }
}

export const delete_book = async (req, res) => {
  const { id } = req.params;

  try {
    const book_with_id = await client.query('SELECT * FROM books WHERE id = $1', [ id ]),
          [ book_row ] = book_with_id.rows;

    if(!book_row) {
      return res.status(404).json({ status: 'Failed', message: `Oops! No book with id ${id} found.` });
    }

    await client.query('DELETE FROM books WHERE id = $1', [ id ]);

    return res.status(200).json({ status: 'Success', message: 'Book deleted from inventory successfully!' });

  } catch (error) {
    console.log(error);
  }
}