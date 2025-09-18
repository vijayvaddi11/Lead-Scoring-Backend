import express from "express";
import multer from "multer";
import dotenv from 'dotenv';
import { Parser } from 'json2csv';
import { parseCSV } from "./utils/csv.js";
import { saveOffer, getOffer, saveLeads, getLeads, saveResults, getResults } from "./storage.js";
import {scoreLeads} from './scoring.js';

const upload = multer({ dest: "tmp/" });
const app = express();

dotenv.config();

app.use(express.json());

//Post /offer
app.post("/offer", (req, res) => {
  const offer = req.body
  if (!offer.name) {
    return res.status(400).json({ error: 'Offer name is required' });
  }
  else {
    saveOffer(offer);
    res.json({ success: true, offer });
  }
});


//POST /leads/upload
app.post("/leads/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({error:"No file uploaded"})
  }
  try {
    const leads = await parseCSV(req.file.path)
    saveLeads(leads)
    res.json({success:true,count:leads.length})
  } catch (err) {
    console.error(err)
    res.status(500).json({error:"Failed to parse csv"})
  }
});

//POST /score
app.post("/score", async (req, res) => {
  const offer = getOffer();
  const leads = getLeads();

  if (!offer || leads.length === 0) {
    return res
      .status(400)
      .json({ error: 'Need an offer and leads uploaded first' });
  }

  // Correct order now (offer, leads)
  const results = await scoreLeads(offer, leads);

  saveResults(results);
  res.json({ success: true, resultsCount: results.length });
});


//GET /results
app.get("/results", (req, res) => {
  res.json(getResults())
});


// GET /results/csv - export results as CSV
app.get('/results/csv', (req, res) => {
  const results = getResults();

  if (!results || results.length === 0) {
    return res
      .status(400)
      .json({ error: 'No results found. Run /score first.' });
  }

  try {
    const fields = ['name', 'role', 'company', 'intent', 'score', 'reasoning'];
    const parser = new Parser({ fields });
    const csv = parser.parse(results);

    res.header('Content-Type', 'text/csv');
    res.attachment('results.csv');
    res.send(csv);
  } catch (err) {
    console.error('⚠️ CSV export failed:', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});


//server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`server running successfully on,${port}`);
});
  

  
  
  

