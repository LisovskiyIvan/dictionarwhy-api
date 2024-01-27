import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'

const app = new Elysia()

app.use(cors({
  origin: true,
  methods: "*"
}))
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


app.onError(({ code }) => `error ${code}`)
app.listen(5500)
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
