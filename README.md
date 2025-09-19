# 📊 Lead Scoring Backend

A Node.js + Express backend service for uploading leads, defining offers, and scoring them using a rule-based + AI pipeline.
The system accepts CSV uploads, applies scoring logic, integrates with the OpenAI API (or other LLMs), and returns results with intent labels (High / Medium / Low).

---

##  Features
- **Offer Management-** Upload product/offer details (name, value props, use cases).
- **Lead Upload –** Upload leads in CSV format.
- **Scoring Pipeline-** Rule-based scoring (Role relevance, Industry match, Data completeness).AI-powered scoring & classification (High / Medium / Low).
- **Results-** Fetch results in JSON or export as CSV.
- **Dockerized-** Simple deployment with Docker.

---

## 🛠 Tech Stack
- **Node.js (Express)** – Backend framework  
- **Multer** – File upload handling  
- **csv-parse** – CSV parsing  
- **OpenAI API** – AI-powered scoring layer
- **json2csv** – Export results as CSV
- **Docker** – Containerization  

---

## ⚡ Getting Started

### 1. Clone Repo
```bash
git clone https://github.com/your-username/lead-scoring-backend.git
cd lead-scoring-backend
```
2. **Install dependencies:**

```bash
npm install
```
3. **Set up environment variables:**

Create a .env file in the root directory with the following content:
```bash
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```


4. **Run Locaally:**
server start at your given PORT
```bash
npm start
```
---

## Run with Docker
1. **Build Image:**
```bash
docker build -t lead-scoring-backend 
```
2. **Run Container:**
```bash
docker run -p 5000:5000 --env-file .env lead-scoring-backend
```
---
# API Endpoints
1. **POST /offer**

Upload offer details.
Request Body (JSON)
```bash
{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"]
}
```
### POST /offer
Upload offer details.  
![Postman Example](https://res.cloudinary.com/vijayvaddi/image/upload/Screenshot_from_2025-09-19_10-39-37_lqycco.png)



2. **POST /leads/upload:**
Upload leads CSV
```bash
CSV Columns: name,role,company,industry,location,linkedin_bio
```
### POST /leads/upload
Upload offer details.  
![Postman Example](https://res.cloudinary.com/vijayvaddi/image/upload/Screenshot_from_2025-09-19_10-48-42_etluk0.png)



3. **POST /score:**
Run scoring for uploaded leads.

### POST POST /score
Upload offer details.  
![Postman Example](https://res.cloudinary.com/vijayvaddi/image/upload/Screenshot_from_2025-09-19_10-51-18_wtnaif.png)


4.**GET /results:**
Get scored leads in JSON.

### GET /results
Upload offer details.  
![Postman Example](https://res.cloudinary.com/vijayvaddi/image/upload/Screenshot_from_2025-09-19_11-16-18_g1cclo.png)


5.**GET /results/csv:**
Export results as CSV file.
### GET /results
We can export CSV file  
![Postman Example](https://res.cloudinary.com/vijayvaddi/image/upload/Screenshot_from_2025-09-19_10-55-48_auagjm.png)
Download CSV file to our Computer
![Postman Example](https://res.cloudinary.com/vijayvaddi/image/upload/Screenshot_from_2025-09-19_10-58-20_eyyhlt.png)

---
## Scoring Logic
1.**Rule Layer (Max 50 points)**
```bash
Role relevance
  Decision maker → +20
  Influencer → +10
Industry match
  Exact ICP → +20
  Adjacent → +10
Data completeness → +10

2.**AI Layer (Max 50 points)**
AI prompt:
Given the product/offer and lead details, classify buying intent 
as High, Medium, or Low and explain in 1–2 sentences.
**Mapping:**
  High → 50
  Medium → 30
  Low → 10
**Final Score = Rule Score + AI Points**
```
---

## Deployment
This backend is deployed on Render:
https://lead-scoring-backend-nhh6.onrender.com

