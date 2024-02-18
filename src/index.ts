import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'
import { UsersDatabase, WordsDatabase } from "./db";
import { auth } from "./auth";
import { translate } from "./translate";


const app = new Elysia()
.onError(({ code, error }) => {
  let status;

  switch (true) {
    case code === 'VALIDATION':
      status = 400;
      break;
    case code === 'NOT_FOUND':
      status = 404;
      break;
    case code === 'INVALID_COOKIE_SIGNATURE':
      status = 401;
      break;
    default:
      status = 500;
  }

  return new Response(error.toString(), { status: status })
}).decorate( 'usersdb', new UsersDatabase()).decorate('wordsdb', new WordsDatabase())

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "DELETE"]
})).group("/api", app => {
  return app
  .get("/", () => "Hi! This is a Dictionarwhy api.")
  
  .post("/search", async ( { body } )=>{
    const word = body.data
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then(res => res.json())
    return response
  }, {
    body: t.Object({ 
      data: t.String() 
  }) 
  })
  .get('/users', ( { usersdb } ) => usersdb.getUsers())
  .post('/signup',  ({usersdb, body}) =>  usersdb.addUser(body), {
    body: t.Object({
      name: t.String(),
      password: t.String()
    })
  })
  // .get('/users/:id',  ({usersdb, params }) =>  usersdb.getUserById(parseInt(params.id)))
  
  .delete('/users/:id', ({usersdb, params }) => usersdb.deleteUser(parseInt(params.id)))
  .post('/words', async ( {usersdb, headers, body, wordsdb } )=> {
    const user = await auth(usersdb, headers)
    if(typeof user == 'string') return user
    const translation: string = await translate(body.word, body.src, body.dest)
    return wordsdb.addWord(body.word, translation, body.dest, user.id as number)
  }, {
    body: t.Object({
      word: t.String(),
      src: t.String(),
      dest: t.String()
    })
  })
  .post('/words/all', async ( { usersdb, headers, wordsdb, body }) => {
    const user = await auth(usersdb, headers)
    if(typeof user == 'string') return user
    const res =  await wordsdb.getAllWordsByLanguage(user.id as number, body.lang)
    if (res.length == 0) return [{error: 'No words found'}]
    else return res
  }, {
    body: t.Object({
      lang: t.String()
    })
  })
  .delete('/words/delete', async ( {usersdb, headers, body, wordsdb } ) => {
    const user = await auth(usersdb, headers)
    if(typeof user == 'string') return user
    wordsdb.deleteWord(user.id as number, body.word)
    const res =  await wordsdb.getAllWordsByLanguage(user.id as number, body.lang)
    if (res.length == 0) return [{error: 'No words found'}]
    else return res
  }, {
    body: t.Object({
      word: t.String(),
      lang: t.String()
    })
  })
})
  

 



app.listen(8080)
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
