import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteTestHistoryMutation,
  useGetTestHistoryQuery,
} from "../../slices/api/historyApi";
import LoadingScreen from "../ui/LoadingScreen";
import { cn } from "../../../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestHistory = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const {
    data,
    isLoading,
    refetch,
    isSuccess: historyIsSuccess,
  } = useGetTestHistoryQuery();
  const [deleteTestHistory, { isSuccess, isError, isLoading: deleteLoading }] =
    useDeleteTestHistoryMutation();
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const handleDeleteHistory = async (item) => {
    setDeleteLoadingId(item._id);
    try {
      await deleteTestHistory({ id: item._id });
    } finally {
      setDeleteLoadingId(null);
      refetch();
    }
  };

  useEffect(() => {
    if (historyIsSuccess) {
      refetch();
    }
    if (isSuccess) {
      toast.success("History Deleted Successfully.");
      refetch();
    } else if (isError) {
      toast.error("Error Deleting History. Please try again");
      refetch();
    }
  }, [isSuccess, isError, historyIsSuccess]);
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="h-full flex flex-col pt-26 p-8">
      <h1 className="text-xl mb-2 text-[var(--text-color)] font-bold pl-2">
        Test History
      </h1>
      {data?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data &&
            data?.map((item, idx) => (
              <div
                key={item?._id}
                className="relative group block p-2 h-full w-full"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <Card
                  className={`cursor-pointer text-center text-lg bg-[var(--nav-bg)]`}
                >
                  <CardTitle className={`text-[var(--text-color)]`}>
                    {item?.request?.name}
                  </CardTitle>
                  <CardDescription
                    className={`font-medium text-lg ${
                      item?.request?.method === "POST"
                        ? "text-amber-600"
                        : item?.request?.method === "GET"
                        ? "text-green-500"
                        : "text-gray-900"
                    }`}
                  >
                    {item?.request?.method}
                  </CardDescription>
                  <CardDescription className="text-[var(--text-color)] truncate">
                    {item?.request?.url}
                  </CardDescription>
                  <div className="bg-[var(--bg-color)]/40 flex cursor-default justify-center rounded-2xl items-center gap-4 p-2">
                    <button
                      onClick={() => handleDeleteHistory(item)}
                      className="text-red-600 font-medium p-2 hover:bg-[var(--bg-color)]/30 rounded-xl cursor-pointer shadow-4xl shadow-gray-900 outline-red-600"
                    >
                      {deleteLoadingId === item?._id ? (
                        <>
                          <Loader2 className="animate-spin" />
                        </>
                      ) : (
                        "Delete"
                      )}
                    </button>
                    <button
                      onClick={() => navigate(`/history/${item?._id}`)}
                      className="bg-[var(--btn-bg)] hover:bg-[var(--btn-hover)] text-white p-2 px-3 rounded-xl cursor-pointer shadow-4xl shadow-gray-900"
                    >
                      Details
                    </button>
                  </div>
                  <CardDescription className="text-[var(--text-color)] font-medium">
                    {new Date(item?.createdAt).toLocaleString()}
                  </CardDescription>
                </Card>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-[var(--text-color)]">
          No recent tests found.
        </p>
      )}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-2 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-2 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-2", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export default TestHistory;
