import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);
  let [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={item?._id}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-[90%] bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
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

          <Card loading={loading} className="flex flex-col justify-between">
            <div className="w-full h-[180px] overflow-hidden rounded-xl">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>

            {/* Bottom section pinned */}
            <div className="flex items-center justify-between mt-auto pt-4">
              <div className="flex items-center gap-2">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {item.author}
                </p>
              </div>
              {item.price && (
                <p className="text-sm font-semibold text-gray-700 dark:text-zinc-100">
                  ₹{item.price}
                </p>
              )}
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({ className, children, loading }) => {
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-2xl shadow-md p-4 space-y-4 w-full max-w-sm bg-white dark:bg-zinc-900 border dark:border-zinc-700"
        )}
      >
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-zinc-900 border border-transparent dark:border-white/[0.2] border-slate-700 relative z-20",
        "flex flex-col",
        className
      )}
    >
      <div className="relative z-50 flex flex-col flex-grow">{children}</div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4
      className={cn(
        "text-zinc-900 dark:text-zinc-100 font-bold tracking-wide mt-4",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-600 dark:text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
