import React, { useState } from "react";
import FileUpload from "../components/inputs/FileUpload";
import EndpointTable from "../components/testResults/EndpointTable";
import TestResultsTable from "../components/testResults/TestResultsTable";
import ManualInputForm from "../components/inputs/ManualInputForm";
import axios from "axios";
import JwtTokenInput from "../components/inputs/JWTTokenInput";
import { useJwt } from "../context/JWTContext";
function ApiPage() {
  const [activeTab, setActiveTab] = useState("collection");
  const [endpoints, setEndpoints] = useState([]);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = useJwt();
  const runTests = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/test`,
        { endpoints },
        {
          headers: token.token
            ? { Authorization: `Bearer ${token.token}` }
            : {},
        }
      );
      setResults(res.data.results);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Test failed", err);
      alert("Test run failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 bg-[var(--bg-color)] text-[var(--text-color)] px-4 sm:px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* JWT Input */}
        <div className="flex justify-center mb-6">
          <JwtTokenInput />
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-4 flex-wrap">
          {["collection", "manual"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md font-medium shadow-sm transition-all ${
                activeTab === tab
                  ? "text-[var(--text-color)] cursor-not-allowed"
                  : "bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-white hover:opacity-90 cursor-pointer"
              }`}
              onClick={() => {
                setActiveTab(tab);
                setEndpoints([]);
                setResults([]);
                setSummary(null);
              }}
            >
              {tab === "collection" ? "Collection Upload" : "URL Input"}
            </button>
          ))}
        </div>

        {activeTab === "collection" && (
          <>
            <FileUpload setEndpoints={setEndpoints} />

            {endpoints.length > 0 && (
              <>
                <EndpointTable endpoints={endpoints} />
                <div className="flex justify-center my-6">
                  <button
                    onClick={runTests}
                    className="bg-[var(--btn-bg)] cursor-pointer text-white px-6 py-2 rounded-md font-semibold hover:bg-[var(--btn-hover)] transition duration-200"
                  >
                    {loading ? "Running Tests..." : "Run Tests"}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "manual" && (
          <div className="my-6">
            <ManualInputForm setResults={setResults} setSummary={setSummary} />
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Test Results
            </h2>
            <TestResultsTable
              activeTab={activeTab}
              results={results}
              summary={summary}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiPage;
