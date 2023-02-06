import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/getData", async (req, res) => {
  const { query } = req;
  console.log(query);
  const wallet = query.wallet;

  const response = await axios.get(
    "http://ec2-100-24-74-70.compute-1.amazonaws.com:8088/query_proposal/",
    {
      params: { wallet },
    }
  );

  console.log("response.data: ", response.data);

  //const data = await fetchData("getData");
  res.set("Access-Control-Allow-Origin", "*");
  res.send(response.data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🎈`);
});
