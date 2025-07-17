import { app } from "./server";

const port = 8080;

app.listen(port, () => {
    console.log(`Server api-gateway is running on http://localhost:${port}`);
});
