import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { deleteCategory, getCategories, getCategory, patchCategory, postCategory, validateCategories, validateCategoryInput, validateCategoryOutput, } from './db_access.js'

const app = new Hono()

app.get('/', (c) => {
  const data = {hello: "hono"}
  return c.json('Hello Hono!')
})


// Categories

app.get('/categories', async (c) => {
  const s = await getCategories();
  const validate = validateCategories(s);

  if (!validate.success) {
    return c.json({message : "Internal Error"},500);
  }

  return c.json(s,200);
})

app.get('/categories/:slug', async (c) => {
  const slug = c.req.param('slug');
  const s = await getCategory(slug);

  if (!s) {
    return c.json({message : "Not Found"},404)
  }

  

  return c.json(s,200)
})

app.post('/category', async (c) => {
  try {
    const cat = await c.req.json();
    const validate = validateCategoryInput(cat);

    if (!validate.success) {
      return c.json({ error: 'Invalid Data', message: validate.error.flatten() }, 400);
    }

    const s = await postCategory(cat);
    if (!s){
      return c.json({message : "Internal Error"},500)
    }
    return c.json(s, 201); // ✅ Return JSON response
  } catch (e) {
    return c.json({ message: "Bad Request" }, 400);
  }
});


// Ég gerði að mestu og fékk ChatGPT til að laga

app.patch('/category/:slug', async (c) => {
  try {
    const slug = c.req.param('slug'); 
    const cat = await c.req.json(); 

    const validate = validateCategoryInput(cat);

    if (validate.success) {
      try{
        const updatedCategory = await patchCategory(slug,cat);
        if (!updatedCategory) {
          return c.json({message : "Not Found"},404)
        }
        return c.json(updatedCategory, 200); 
      } catch (e) {
        return c.json({message : "Internal Error"},500)
      }
    } else {
      return c.json({ message: "Invalid Data"}, 400);
    }
  } catch (e) {
    return c.json({ message: "Bad Request" }, 400);
  }
});


app.delete('/category/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')
    const s = await deleteCategory(slug);

    if(s) {
      return c.json(204);
    } else {
      return c.json({message : "Not Found"})
    }
    
  } catch(e) {
    return c.json({message : "Internal Error"},500)
  }
})


// Questions



// Serve

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
