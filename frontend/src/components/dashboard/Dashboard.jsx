// DashboardPage.jsx

import { useGetTestHistoryQuery } from "../../slices/api/historyApi";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";

const COLORS = [
  "#8884d8",
  "#02ca9d",
  "#ffc658",
  "#ff8042",
  "#ff0000",
  "#0000ff",
];
const statusColor = {
  1: "text-white",
  2: "text-green-400",
  4: "text-red-500",
  W: "text-red-500",
  5: "text-orange-300",
};

export default function DashboardPage() {
  const { data: history = [], isLoading, refetch } = useGetTestHistoryQuery();
  const [tab, setTab] = useState("recent");
  const [search, setSearch] = useState("");

  const statusSummary = useMemo(() => {
    const summary = { success: 0, failed: 0 };
    history.forEach((h) => {
      if (h.response?.isSuccess) summary.success++;
      else summary.failed++;
    });
    return summary;
  }, [history]);

  const methodSummary = useMemo(() => {
    const counts = {};
    history.forEach((h) => {
      const m = h.request?.method?.toUpperCase();
      counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts).map(([method, count]) => ({ method, count }));
  }, [history]);

  const responseTimeDistribution = useMemo(() => {
    const buckets = {
      "<200ms": 0,
      "200-500ms": 0,
      "500-1000ms": 0,
      ">1000ms": 0,
    };
    history.forEach((h) => {
      const time = parseInt(h.response?.duration, 10);
      if (time < 200) buckets["<200ms"]++;
      else if (time < 500) buckets["200-500ms"]++;
      else if (time < 1000) buckets["500-1000ms"]++;
      else buckets[">1000ms"]++;
    });
    return Object.entries(buckets).map(([label, value]) => ({
      name: label,
      value,
    }));
  }, [history]);

  const statusCodeDistribution = useMemo(() => {
    const codes = {};
    history.forEach((h) => {
      const code = h.response?.status;
      codes[code] = (codes[code] || 0) + 1;
    });
    return Object.entries(codes).map(([code, count]) => ({
      name: code,
      value: count,
    }));
  }, [history]);

  const errorTypeBreakdown = useMemo(() => {
    const breakdown = {};
    history.forEach((h) => {
      const type =
        h.response?.errorType || (h.response?.isSuccess ? "None" : "Unknown");
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [history]);

  const topSlowest = useMemo(() => {
    return [...history]
      .sort(
        (a, b) =>
          parseInt(b.response?.duration, 10) -
          parseInt(a.response?.duration, 10)
      )
      .slice(0, 5)
      .map((h) => ({
        name: h.request?.url,
        value: parseInt(h.response?.duration, 10),
      }));
  }, [history]);

  const latestTests = useMemo(() => {
    return history.filter((h) => h.request?.url?.includes(search)).slice(0, 10);
  }, [history, search]);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border p-2 rounded shadow text-sm">
          <p className="text-gray-500">{label}</p>
          <p className="text-amber-600 font-semibold">{`${payload[0].value} ms`}</p>
        </div>
      );
    }
  };
  useEffect(() => {
    refetch();
  }, [history]);
  return (
    <div className="p-8 space-y-6 pt-26">
      <h1 className="text-2xl pl-2 font-bold">Dashboard</h1>
      {history.length ? (
        <>
          <div className="grid text-white grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={`bg-gray-900`}>
              <CardContent className="p-4">
                <p className="text-muted-foreground">Total Tests</p>
                <p className="text-2xl font-bold">{history.length}</p>
              </CardContent>
            </Card>
            <Card className={`bg-green-600`}>
              <CardContent className="p-4">
                <p className="text-muted-foreground">Success</p>
                <p className="text-2xl font-bold">{statusSummary.success}</p>
              </CardContent>
            </Card>
            <Card className={`bg-red-600`}>
              <CardContent className="p-4">
                <p className="text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold">{statusSummary.failed}</p>
              </CardContent>
            </Card>
            <Card className={`bg-blue-600`}>
              <CardContent className="p-4">
                <p className="text-muted-foreground">Methods</p>
                <p className="text-2xl font-bold">{methodSummary.length}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="mt-6">
            <div className="mb-4 md:hidden">
              <select
                value={tab}
                onChange={(e) => setTab(e.target.value)}
                className="w-full border rounded-md p-2 text-sm cursor-pointer"
              >
                <option
                  value="recent"
                  className="cursor-pointer bg-[var(--input-bg)]"
                >
                  Recent
                </option>
                <option
                  value="method"
                  className="cursor-pointer bg-[var(--input-bg)]"
                >
                  By Method
                </option>
                <option
                  value="status"
                  className="cursor-pointer bg-[var(--input-bg)]"
                >
                  By Status
                </option>
                <option
                  value="response"
                  className="cursor-pointer bg-[var(--input-bg)]"
                >
                  Response Time
                </option>
                <option
                  value="codes"
                  className="cursor-pointer bg-[var(--input-bg)]"
                >
                  Status Codes
                </option>
                <option
                  value="errors"
                  className="cursor-pointer bg-[var(--input-bg)]"
                >
                  Warnings/Errors
                </option>
                <option
                  value="slow"
                  className="cursor-pointer bg-[var(--input-bg)]"
                >
                  Top Slowest
                </option>
              </select>
            </div>
            <TabsList className="mb-4 hidden md:block">
              <TabsTrigger
                className={`hover:bg-[var(--nav-bg)] cursor-pointer`}
                value="recent"
              >
                Recent
              </TabsTrigger>
              <TabsTrigger
                className={`hover:bg-[var(--nav-bg)] cursor-pointer`}
                value="method"
              >
                By Method
              </TabsTrigger>
              <TabsTrigger
                className={`hover:bg-[var(--nav-bg)] cursor-pointer`}
                value="status"
              >
                By Status
              </TabsTrigger>
              <TabsTrigger
                className={`hover:bg-[var(--nav-bg)] cursor-pointer`}
                value="response"
              >
                Response Time
              </TabsTrigger>
              <TabsTrigger
                className={`hover:bg-[var(--nav-bg)] cursor-pointer`}
                value="codes"
              >
                Status Codes
              </TabsTrigger>
              <TabsTrigger
                className={`hover:bg-[var(--nav-bg)] cursor-pointer`}
                value="errors"
              >
                Warnings/Errors
              </TabsTrigger>
              <TabsTrigger
                className={`hover:bg-[var(--nav-bg)] cursor-pointer`}
                value="slow"
              >
                Top Slowest
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recent">
              <SearchIcon className="absolute z-100 text-[var(--text-color)] mt-2 ml-2" />
              <input
                placeholder="Filter by URL"
                className="mb-4 shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-[var(--input-bg)] px-10 py-2 text-sm text-[var(--text-color)] transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {latestTests.length ? (
                <ul className="space-y-2">
                  {latestTests?.map((h) => (
                    <li
                      key={h._id}
                      className="border p-3 rounded-md flex flex-col gap-2 bg-[var(--nav-bg)] text-[var(--text-color)]"
                    >
                      <div className="flex flex-col-reverse gap-2 items-start md:flex-row justify-between md:items-center">
                        <p className="text-sm font-medium contain-content truncate max-w-[95%]">
                          {h.request.method} - {h.request.url}
                        </p>
                        <Badge
                          className={` text-white ${
                            h.response?.isSuccess
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {h.response?.isSuccess ? "Success" : "Failed"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Status:{" "}
                        <span
                          className={`${
                            statusColor[(h?.response?.status)[0]] ||
                            "text-white"
                          }`}
                        >
                          {h.response.status}
                        </span>{" "}
                        • {new Date(h.createdAt).toLocaleString()}
                      </p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>⏱️ {h.response?.duration}</span>
                        <span>
                          📦 {h.request?.body ? "With Body" : "No Body"}
                        </span>
                        <span>
                          📋 {Object.keys(h.request?.headers || {}).length}{" "}
                          Headers
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-[var(--text-color)]">
                  No recent tests found.
                </p>
              )}
            </TabsContent>

            <TabsContent value="method">
              {methodSummary.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={methodSummary}>
                    <XAxis dataKey="method" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      className="cursor-pointer"
                      dataKey="count"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-[var(--text-color)]">
                  No recent tests found.
                </p>
              )}
            </TabsContent>

            <TabsContent value="status">
              {statusSummary.success || statusSummary.failed ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { label: "Success", count: statusSummary.success },
                      { label: "Failed", count: statusSummary.failed },
                    ]}
                  >
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      className="cursor-pointer"
                      dataKey="count"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-[var(--text-color)]">
                  No recent tests found.
                </p>
              )}
            </TabsContent>

            <TabsContent value="response">
              {responseTimeDistribution ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={responseTimeDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {responseTimeDistribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          className="cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-[var(--text-color)]">
                  No recent tests found.
                </p>
              )}
            </TabsContent>

            <TabsContent value="codes">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusCodeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#82ca9d"
                    label
                  >
                    {statusCodeDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="errors">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={errorTypeBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#ff8042"
                    label
                  >
                    {errorTypeBreakdown.map((_, index) => (
                      <Cell
                        className="cursor-pointer"
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="slow">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSlowest}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-10}
                  />
                  <YAxis label="Duration (in ms)" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    className="cursor-pointer"
                    dataKey="value"
                    fill="#d97706"
                  />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <p className="text-center text-[var(--text-color)]">
          No recent tests found.
        </p>
      )}
    </div>
  );
}
