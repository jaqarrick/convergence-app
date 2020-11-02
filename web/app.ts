import express from "express"
import path from "path"
const app = express()

app.use(express.static(path.join(__dirname, "../build")))

app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"))
})
const port = process.env.port || 3001
app.listen(port, () => {
	console.log(`the web server is up and running on port ${port}`)
})
