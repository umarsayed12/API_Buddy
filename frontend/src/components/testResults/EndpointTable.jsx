import React from "react";

function EndpointTable({ endpoints }) {
  return (
    <div className="overflow-x-auto bg-[var(--nav-bg)] shadow-md shadow-black rounded-xl p-4">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr className="bg-[var(--bg-color)] text-[var(--text-color)]">
            <th className="p-2">Name</th>
            <th className="p-2">Method</th>
            <th className="p-2">URL</th>
            <th className="p-2">Body</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((ep, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 text-[var(--text-color)]">{ep.name}</td>
              <td className="p-2 font-bold text-[var(--accent-color)]">
                {ep.method}
              </td>
              <td className="p-2 text-sm text-[var(--text-color)]">{ep.url}</td>
              <td className="p-2 whitespace-pre-wrap text-xs text-[var(--text-color)]">
                {ep.body || "Body Empty"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EndpointTable;
