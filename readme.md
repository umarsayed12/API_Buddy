# API Buddy

An intelligent, Postman-like platform that automates API testing using AI capabilities. This tool simplifies manual and batch endpoint testing with features like AI error explanation, collection file upload, JWT support, request preview, test summary, and a modern UI/UX tailored for productivity.

---

## Motivation

While traditional tools like Postman provide a solid manual API testing experience, there's a gap in:

- Automatically explaining **why** an API failed
- Providing test summaries for entire collections
- Allowing batch testing with **prompt-based** enhancements
- Simplifying both **collection-based** and **manual URL input** testing under one UI

**API Buddy** aims to fill that gap by integrating AI into the workflow while keeping the experience developer-friendly.

---

## Key Features

### Manual URL Input Form

- Fully functional form for manual requests.
- Set:

  - Endpoint name
  - HTTP method (GET, POST, PUT, DELETE, etc.)
  - Target URL
  - Headers
  - Optional request body

- Immediate test execution with visual response feedback.

### Collection File Upload (Postman JSON)

- Upload a `.json` file exported from Postman.
- Automatically parses and extracts:

  - Name
  - Method
  - URL
  - Headers
  - Body (if applicable)

- Supports batch testing for all extracted endpoints.

### JWT Auth Token UI

- Input and store JWT tokens in a dedicated UI field.
- Automatically reused in `Authorization` headers for all requests.
- Option to clear/reset the token easily.

### Test Result View + Error Parsing

- Clean and formatted response display:

  - Supports stringified objects/arrays
  - Displays raw and parsed error content (even HTML)

- Highlights key response properties and status codes.
- Enhanced readability for developers during failure analysis.

### Dual Tab UI

- Simple tab-based layout for:

  - Collection Upload
  - Manual Input

- Only one mode active at a time for a clean, non-conflicting UX.

### Response Table with Summary

- Displays results in a table view:

  - Endpoint-wise status
  - Individual response time

- Shows overall summary:

  - Passed
  - Failed
  - Total tests
  - Avg. response time

### AI-Powered Explanation (Gemini)

- For failed endpoints:

  - Click **"Explain"**
  - Gemini AI analyzes request, response, and error
  - Provides a human-friendly reason for the failure

### Modal Output for AI

- AI explanation is displayed in a modal:

  - Clean formatting
  - Actionable insights where possible

### Security Analyzer Module

- Automatically detects common API security issues:
  - Missing headers like **CORS**, **Content-Security-Policy**, etc.
  - Use of insecure **HTTP** URLs instead of **HTTPS**
  - Unsafe handling of **authentication tokens**
- Flags security warnings directly in the test results view
- Helps developers identify and address vulnerabilities early

### Save & View Test History

- Enables users to save results of API tests (manual or from collections) for later viewing.
- Stores:

  - Test type
  - Test name
  - Request details: method, URL, headers, body
  - Response details: status code, data, duration, warnings, and concise error summaries
  - Timestamp and overall status

- View full test result by ID with a raw JSON viewer for advanced inspection.
- Helps maintain a historical record for debugging or auditing.
- Built using MongoDB, Express, RTK Query, and Tailwind UI.

### Dashboard

The **Dashboard** gives a visual summary of all recent API tests which are saved in history.

- **Summary Cards**

  - Total Tests, Success, Failure, and HTTP Methods count.

- **Tabs for Insights**

  - **Recent**: Latest 10 tests with search.
  - **By Method**: HTTP method distribution (GET, POST, etc.).
  - **By Status**: Success vs Failure count.
  - **Response Time**: Pie chart of duration ranges.
  - **Status Codes**: Count of each HTTP status.
  - **Warnings/Errors**: Error type breakdown.

- **Performance Chart**
  - Top 5 slowest requests to debug latency.

---

## Updated Tech Stack

### Frontend

* **React 19** — Core UI library for building modern interfaces
* **Vite** — Fast build tool and development server
* **TailwindCSS** — Utility-first styling framework
* **Radix UI** — Accessible and customizable UI primitives (Dialog, Tabs, Select, Dropdown, etc.)
* **React Router v7** — Client-side routing
* **Redux Toolkit** — Simplified global state management
* **RTK Query** — API caching and async request management
* **Recharts** — Charting for dashboard insights
* **React Hook Form** — Minimal re-rendering form validation
* **Lucide Icons & Tabler Icons** — Clean, modern icon sets
* **React Dropzone** — File upload support for Postman collection JSONs
* **JWT Decode** — Parses and verifies JWT tokens on the client
* **Sonner** — Lightweight toast notification system
* **Tailwind Merge & Animate** — Utility conflict resolution and animations

### Backend

* **Node.js + Express 5** — Lightweight server and API execution layer
* **Axios** — Handles internal HTTP requests and API tests
* **Google Gemini API** — AI error analysis and natural language explanations
* **MongoDB + Mongoose** — Test history persistence and querying
* **JWT + Bcrypt** — Authentication and secure password storage
* **CORS + Cookie Parser** — Cross-origin handling and cookie support
* **Multer** — Handles file uploads (Postman collections)
* **Dotenv** — Environment variable management
  
---

## Roadmap / Upcoming Features

### Prompt-based Agent Mode

- Users can type prompts like:

  - "Test all GET endpoints"
  - "Explain why login fails"

- AI interprets and executes tests

### Advanced Batch Modes

- Group endpoints by:

  - Method
  - Module
  - Domain

- Stage-wise execution

### Shareable Test Results

- Share test run results with a link
- Enable collaborative debugging

### Mobile-Responsive UI

- Optimized design for smaller screens

---

### 1. GET

```json
Name: Get Todos
Method: GET
URL: https://jsonplaceholder.typicode.com/todos/1
```

### 2. POST

```json
Name: Create Post
Method: POST
URL: https://jsonplaceholder.typicode.com/posts
Body:
{
  "title": "foo",
  "body": "bar",
  "userId": 1
}
```

---

## UI Overview

- **Login and Signup pages** with JWT-based authentication  
- **Dual-tab layout** for Manual and Collection modes  
- **Manual request form** with method, URL, headers, and body  
- **Postman collection upload** with automatic endpoint parsing  
- **Batch testing support** for uploaded collection files  
- **JWT token input** with auto-injection into Authorization header  
- **Test button** for running individual or all requests  
- **Test result table** showing method, status, and response time  
- **Clickable rows** to view full API response details  
- **AI explanation button** for failed test cases  
- **Modal view** for Gemini AI-powered error analysis  
- **Security analyzer** for header and protocol warnings  
- **Save test results** with full request/response data  
- **History viewer** to browse and inspect past test sessions  
- **Dashboard** with total, pass/fail counts and status breakdown  
- **Response time and error insights** visualized via charts  
- **Chart components** showing method distribution and slow endpoints  

---

## Setup Instructions

### Frontend:

```bash
git clone <repo-url>
cd frontend
npm install
npm run dev
```

### Backend:

```bash
cd backend
npm install
npm start
```

Make sure to:

- Update your Gemini API key
- Enable CORS if running frontend separately

---

## 🙌 Credits

- Built by Umar Khursheed
- Powered by Google Gemini API ⚡
