import { app } from "./app";

const port = 3000;
app.listen(port, () => {
    console.log(`server running on the port ${port}`)
});