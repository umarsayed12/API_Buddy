import React, { useState } from "react";
import axios from "axios";
import { useJwt } from "../../context/JWTContext";

function ManualInputForm({ setResults, setSummary }) {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState(false);
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState('{"Content-Type":"application/json"}');
  const [bodyError, setBodyError] = useState("");
  const [headersError, setHeadersError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useJwt();

  const parseJSON = (jsonString, labelSetter) => {
    try {
      return JSON.parse(jsonString || "{}");
    } catch (err) {
      labelSetter("Invalid JSON format");
      return null;
    }
  };

  const handleSend = async () => {
    setUrlError(false);
    setBodyError("");
    setHeadersError("");

    if (!url.trim()) {
      setUrlError(true);
      return;
    }

    const parsedHeaders = parseJSON(headers, setHeadersError);
    const parsedBody = parseJSON(body, setBodyError);

    if (
      headersError ||
      (["POST", "PUT", "PATCH"].includes(method) && bodyError)
    ) {
      return;
    }

    const finalHeaders = {
      ...(parsedHeaders || {}),
      ...(token.token && { Authorization: `Bearer ${token.token}` }),
    };

    const endpoint = {
      name: "Manual Request",
      method,
      url,
      body: JSON.stringify(parsedBody || {}),
      headers: finalHeaders,
    };

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/test`,
        {
          endpoints: [endpoint],
        }
      );

      setResults(res.data.results);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Manual send failed", err);
      alert("Manual test failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow rounded-lg p-6 space-y-4 bg-[var(--nav-bg)] border text-[var(--text-color)]">
      <h2 className="text-lg font-semibold mb-2">Manual API Request</h2>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="p-2 border rounded bg-[var(--input-bg)] cursor-pointer text-[var(--text-color)] border-[var(--accent-color)]"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter API URL"
            className="flex-grow p-2 border rounded bg-[var(--input-bg)] border-[var(--accent-color)] text-[var(--text-color)]"
          />

          <button
            onClick={handleSend}
            disabled={loading}
            className="hidden sm:block px-4 py-2 cursor-pointer rounded bg-[var(--btn-bg)] text-white hover:bg-[var(--btn-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
        {urlError && (
          <p className="text-red-500 text-sm">Please enter a valid URL.</p>
        )}
        <button
          onClick={handleSend}
          disabled={loading}
          className="sm:hidden px-4 py-2 rounded bg-[var(--accent-color)] text-[var(--text-color)] hover:bg-[var(--btn-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      {(method === "POST" || method === "PUT" || method === "PATCH") && (
        <div>
          <label className="font-semibold text-lg mb-1 block">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Request Body (JSON)"
            rows={5}
            className="w-full p-2 border rounded font-mono text-sm bg-[var(--input-bg)] border-[var(--accent-color)] text-[var(--text-color)]"
          />
          {bodyError && (
            <p className="text-red-500 text-sm mt-1">{bodyError}</p>
          )}
        </div>
      )}
      <div>
        <label className="font-semibold text-lg mb-1 block">Headers</label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='Headers (JSON), e.g. {"Authorization": "Bearer ..."}'
          rows={4}
          className="w-full p-2 border rounded font-mono text-sm bg-[var(--input-bg)] border-[var(--accent-color)] text-[var(--text-color)]"
        />
        {headersError && (
          <p className="text-red-500 text-sm mt-1">{headersError}</p>
        )}
      </div>
    </div>
  );
}

export default ManualInputForm;
