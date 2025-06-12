import axios from "axios";
import securityAnalyzer from "../middlewares/securityAnalyzer.js";
export const runTests = async (req, res) => {
  const endpoints = req.body.endpoints;

  const results = [];

  let total = 0;
  let passed = 0;
  let failed = 0;
  let totalTime = 0;

  for (let ep of endpoints) {
    const { method, url, body, headers = {} } = ep;
    const result = {
      name: ep.name,
      method,
      url,
    };

    total++;

    let parsedBody = {};
    if (
      (method === "POST" || method === "PUT") &&
      (!body || body.trim() === "{}" || body.trim() === "")
    ) {
      result.status = "WARN";
      result.time = "-";
      result.error = `Missing or empty request body for ${method}`;
      failed++;
      results.push(result);
      continue;
    } else {
      try {
        parsedBody = body ? JSON.parse(body) : {};
      } catch (err) {
        result.status = "ERR";
        result.time = "-";
        result.error = "Invalid JSON body";
        failed++;
        results.push(result);
        continue;
      }
    }

    const options = {
      method,
      url,
      data: parsedBody,
      headers,
      validateStatus: () => true,
    };

    try {
      const start = Date.now();
      const response = await axios(options);
      const duration = Date.now() - start;
      result.data = response.data || null;
      result.status = response.status;
      result.time = `${duration} ms`;
      result.error = response.status >= 400 ? response.data : null;
      result.securityWarnings = securityAnalyzer(response, url);

      totalTime += duration;

      if (response.status >= 200 && response.status < 300) {
        passed++;
      } else {
        failed++;
      }
    } catch (err) {
      result.status = "ERR";
      result.time = "-";
      result.error = err.message;
      failed++;
    }

    results.push(result);
  }

  const avgTime = total > 0 ? Math.round(totalTime / total) : 0;

  const summary = {
    total,
    passed,
    failed,
    avgTime: `${avgTime} ms`,
  };

  res.json({ summary, results });
};
