import { app } from "./server";

const port = 6001;

app.listen(port, () => {
    console.log(`Server auth-service is running on http://localhost:${port}`);
});
