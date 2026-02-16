import express from "express"
import {dirname} from "path"
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3000;

function isWeekDay(dayNum) {
    if (dayNum < 6) {
        return true
    } else {
        return false
    }
}

app.get("/", (req, res) => {
    res.render(`index.ejs`, {
       day: isWeekDay(new Date().getDay()) ? "It's a weekday, it's time to work hard!" : "It's the weekend, it's time to have fun!"
    })
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
})