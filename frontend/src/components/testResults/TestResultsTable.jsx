import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { CloudSnowIcon, Loader2 } from "lucide-react";
import { useSaveTestHistoryMutation } from "../../slices/api/historyApi";
import { extractErrorSummary, truncateIfTooLarge } from "../../lib/utils";
import { IconMessageDots } from "@tabler/icons-react";
import { useEffect } from "react";
import { toast } from "sonner";

function TestResultsTable({ activeTab, results, summary }) {
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [warningModalData, setWarningModalData] = useState(null);
  const [warningExplainIndex, setWarningExplainIndex] = useState(null);
  const [warningAIResponses, setWarningAIResponses] = useState({});
  const [saveTestLoad, setSaveTestLoad] = useState(null);
  const [
    saveTestHistory,
    { isSuccess: saveHistoryIsSuccess, isError: saveHistoryIsError },
  ] = useSaveTestHistoryMutation();
  const handleWarningClick = (warnings, index, url) => {
    setWarningModalData({ warnings, index, url });
    setWarningAIResponses({});
  };
  const handleWarningExplain = async (warning, index, url) => {
    if (warningAIResponses && warningAIResponses[index]) {
      setWarningAIResponses((prev) => {
        const updated = {};
        Object.keys(prev).forEach((key) => {
          updated[key] = { ...prev[key], show: false };
        });

        updated[index] = {
          message: warningAIResponses[index].message,
          show: true,
        };

        return updated;
      });
    } else {
      setWarningExplainIndex(index);
      try {
        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/ai/explain-security-warnings`,
          {
            warning,
            url,
          }
        );

        setWarningAIResponses((prev) => {
          const updated = {};
          Object.keys(prev).forEach((key) => {
            updated[key] = { ...prev[key], show: false };
          });

          updated[index] = {
            message: res.data.explanation,
            show: true,
          };

          return updated;
        });
      } catch (err) {
        console.log("Warning AI failed:", err);
        alert("AI explanation for warning failed");
      } finally {
        setWarningExplainIndex(null);
      }
    }
  };

  const handleExplain = async (result, index) => {
    setLoadingIndex(index);
    setAiResponse(null);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/explain`,
        result
      );
      setAiResponse(res.data.explanation);
      setShowModal(true);
    } catch (err) {
      console.log("AI Failed : ", err);
      alert("AI explanation failed");
    } finally {
      setLoadingIndex(null);
    }
  };
  function parseBold(text) {
    const codeSplit = text.split(/(`[^`]+`)/g);

    return codeSplit.map((segment, i) => {
      if (segment.startsWith("`") && segment.endsWith("`")) {
        return (
          <code
            key={`code-${i}`}
            className="bg-[var(--nav-bg)] px-1 py-0.5 rounded text-sm"
          >
            {segment.slice(1, -1)}
          </code>
        );
      }
      const boldSplit = segment.split(/(\*\*[^*]+\*\*)/g);
      return boldSplit.map((part, j) => {
        if (
          part.startsWith("**") &&
          (part.endsWith("**") || part.endsWith("**."))
        ) {
          return <strong key={`bold-${i}-${j}`}>{part.slice(2, -2)}</strong>;
        }
        return <span key={`text-${i}-${j}`}>{part}</span>;
      });
    });
  }
  function extractErrorMessage(htmlString) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");
      const pre = doc.querySelector("pre");
      if (pre) {
        return pre.innerHTML
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#039;/g, `'`)
          .replace(/&quot;/g, `"`);
      }
      return htmlString;
    } catch {
      return htmlString;
    }
  }
  const statusColor = {
    1: "text-white",
    2: "text-green-400",
    4: "text-red-500",
    W: "text-red-500",
    5: "text-orange-300",
  };
  const timeoutRef = useRef(null);
  const pendingRequestsRef = useRef(new Map());
  const lastSavedRef = useRef(new Map());
  const generateRequestKey = (res) => {
    return `${res.method}-${res.url}-${JSON.stringify(res.body) || ""}-${
      JSON.stringify(res.headers) || ""
    }`;
  };
  const delay = 1000;

  const handleSaveHistory = useCallback(
    // History Save with Debouncing
    async (res, idx) => {
      setSaveTestLoad(idx);
      const requestKey = generateRequestKey(res);
      const now = Date.now();
      const lastSaved = lastSavedRef.current.get(requestKey);
      if (lastSaved && now - lastSaved < 10000) {
        toast.error("Test Already Saved. Please wait for 10s");
        setSaveTestLoad(null);
        return;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      pendingRequestsRef.current.set(requestKey, {
        res,
        activeTab,
        timestamp: now,
      });
      timeoutRef.current = setTimeout(async () => {
        const pending = pendingRequestsRef.current.get(requestKey);
        if (!pending) return;

        try {
          await saveTestHistory({
            testType: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
            testName: truncateIfTooLarge(pending?.res?.name),
            request: {
              name: truncateIfTooLarge(pending?.res?.name),
              method: pending.res?.method,
              url: pending.res?.url,
              body: truncateIfTooLarge(pending?.res?.body),
              headers: truncateIfTooLarge(pending?.res?.headers),
            },
            response: {
              status:
                typeof pending.res.status === "string"
                  ? pending.res.status
                  : JSON.stringify(pending?.res?.status),
              data: truncateIfTooLarge(pending?.res?.data),
              duration: pending?.res?.time,
              isSuccess:
                pending?.res?.status >= 200 && pending?.res?.status < 300,
              warnings: pending?.res?.securityWarnings
                ? pending?.res?.securityWarnings
                : "",
              errorSummary:
                typeof extractErrorSummary(pending?.res?.error) !== "string"
                  ? JSON.stringify(extractErrorSummary(pending?.res?.error))
                  : extractErrorSummary(pending?.res?.error),
            },
          });
          lastSavedRef.current.set(requestKey, now);
          pendingRequestsRef.current.delete(requestKey);
        } catch (err) {
          console.error("Failed to save test history:", err.message);
          pendingRequestsRef.current.delete(requestKey);
        } finally {
          setSaveTestLoad(null);
        }
      }, delay);
    },
    [saveTestHistory, delay]
  );

  useEffect(() => {
    if (saveHistoryIsSuccess) {
      toast.success("Test Saved Successfully");
    } else if (saveHistoryIsError) {
      toast.error("Failed to save Test. Please try again");
    }
  }, [saveHistoryIsSuccess, saveHistoryIsError]);
  return (
    <div className="overflow-x-auto w-full mb-4 bg-[var(--nav-bg)] text-[var(--text-color)] shadow-2xl shadow-black rounded-xl p-4 space-y-6">
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-white">
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="font-medium">Total</div>
            <div className="text-xl font-bold">{summary.total}</div>
          </div>
          <div className="bg-green-600 rounded-lg p-3">
            <div className="font-medium">Passed</div>
            <div className="text-xl font-bold">{summary.passed}</div>
          </div>
          <div className="bg-red-600 rounded-lg p-3">
            <div className="font-medium">Failed</div>
            <div className="text-xl font-bold">{summary.failed}</div>
          </div>
          <div className="bg-blue-600 rounded-lg p-3">
            <div className="font-medium">Avg Time</div>
            <div className="text-xl font-bold">{summary.avgTime}</div>
          </div>
        </div>
      )}

      <table className="min-w-full border text-sm text-left">
        <thead className="bg-[var(--bg-color)]">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Method</th>
            <th className="p-2">URL</th>
            <th className="p-2">Status</th>
            <th className="p-2">Time</th>
            <th className="p-2">Response</th>
            <th className="p-2">AI Explain</th>
            <th className="p-2">Warnings</th>
            <th className="p-2">Save</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{res.name}</td>
              <td className="p-2">{res.method}</td>
              <td className="p-2 text-sm">{res.url}</td>
              <td
                className={`p-2 font-semibold ${
                  statusColor[String(res.status)[0]]
                }`}
              >
                {res.status}
              </td>
              <td className="p-2">{res.time}</td>
              <td className="p-2 text-xs whitespace-pre-wrap">
                {res.error ? (
                  <div className="text-red-600">
                    <div className="font-bold mb-1">Error : </div>
                    <div className="max-h-[180px] overflow-y-scroll text-red-600 whitespace-pre-wrap text-sm bg-[var(--input-bg)] p-2 rounded border">
                      {typeof extractErrorMessage(res.error) === "string"
                        ? extractErrorMessage(res.error)
                        : JSON.stringify(extractErrorMessage(res.error))}
                    </div>
                  </div>
                ) : res.data ? (
                  <div className="">
                    <div className="text-green-600 font-bold mb-1">Success</div>
                    <div className="font-bold mb-1">Data :</div>
                    <div className="max-h-[180px] max-w-[550px] overflow-y-scroll text-[var(--text-color)] whitespace-pre-wrap text-sm bg-[var(--input-bg)] p-2 rounded border">
                      {(() => {
                        if (typeof res.data === "string") {
                          return res.data;
                        } else if (Array.isArray(res.data)) {
                          return (
                            <>
                              [
                              {res.data.map((item, idx) =>
                                typeof item === "object" ? (
                                  <div key={idx}>
                                    {JSON.stringify(item, null, 2)},
                                  </div>
                                ) : (
                                  <div key={idx}>{item}</div>
                                )
                              )}
                              ]
                            </>
                          );
                        } else if (typeof res.data === "object") {
                          return JSON.stringify(res.data, null, 2);
                        } else {
                          return String(res.data);
                        }
                      })()}
                    </div>
                  </div>
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2">
                {res.error ? (
                  <button
                    className="text-sm cursor-pointer flex justify-center items-center bg-[var(--btn-bg)] text-white px-3 py-1 rounded hover:bg-[var(--btn-hover)] transition"
                    onClick={() => handleExplain(res, i)}
                  >
                    {loadingIndex === i ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Explain"
                    )}
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2">
                {res.securityWarnings && res.securityWarnings.length > 0 ? (
                  <button
                    className="text-yellow-500 font-semibold cursor-pointer hover:bg-gray-600 flex justify-center items-center p-1 rounded-sm"
                    onClick={() =>
                      handleWarningClick(res.securityWarnings, i, res.url)
                    }
                  >
                    {res.securityWarnings.length}⚠️
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td className="p-2">
                <button
                  className="text-yellow-500 font-semibold cursor-pointer hover:bg-gray-600 flex justify-center items-center p-1 rounded-sm"
                  onClick={() => handleSaveHistory(res, i)}
                >
                  {saveTestLoad === i ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "💾"
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && aiResponse && (
        <div className="fixed overflow-y-auto inset-0 bg-[var(--bg-color)] bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-[var(--nav-bg)] max-h-[90%] overflow-scroll rounded-xl shadow-lg p-6 max-w-2xl">
            <h3 className="text-[var(--text-color)] font-semibold mb-4">
              API Buddy Explanation
            </h3>
            <pre className="whitespace-pre-wrap text-sm text-[var(--text-color)] mb-4">
              {parseBold(aiResponse)}
            </pre>
            <div className="flex gap-2 justify-center">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="flex justify-center items-center gap-1 text-white px-4 py-2 rounded bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <IconMessageDots />
                Chat with AI
              </button>
            </div>
          </div>
        </div>
      )}
      {warningModalData && (
        <div className="fixed inset-0 bg-[var(--bg-color)] bg-opacity-30 overflow-y-scroll flex justify-center items-center z-50">
          <div className="bg-[var(--nav-bg)] absolute text-[var(--text-color)] rounded-xl shadow-lg p-6 max-w-5xl w-full">
            <h3 className="text-lg font-semibold mb-4 ">Security Warnings</h3>
            <table className="w-full border text-sm mb-4">
              <thead className="bg-[var(--bg-color)]">
                <tr>
                  <th className="p-2 text-left">Warning</th>
                  <th className="p-2 text-left">AI Explain</th>
                </tr>
              </thead>
              <tbody>
                {warningModalData.warnings.map((warning, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{warning}</td>
                    <td className="p-2">
                      {warningAIResponses[idx]?.show ? (
                        <div className="text-[var(--text-color)] max-h-[250px] whitespace-pre-wrap bg-[var(--bg-color)] p-2 rounded overflow-y-scroll">
                          {parseBold(warningAIResponses[idx].message)}
                        </div>
                      ) : (
                        <button
                          className="text-sm flex justify-center items-center bg-[var(--btn-bg)] cursor-pointer text-white w-28 py-2 rounded hover:bg-[var(--btn-hover)] transition"
                          onClick={() =>
                            handleWarningExplain(
                              warning,
                              idx,
                              warningModalData.url
                            )
                          }
                          disabled={warningExplainIndex === idx}
                        >
                          {warningExplainIndex === idx ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Explain"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 justify-center">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
                onClick={() => setWarningModalData(false)}
              >
                Close
              </button>
              <button
                className="flex justify-center items-center gap-1 text-white px-4 py-2 rounded bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <IconMessageDots />
                Chat with AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestResultsTable;
