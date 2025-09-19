/* eslint-disable no-unused-vars */
// src/pages/admin/AdminInboxPage.jsx
import React, { useMemo, useState } from "react";
import { useGetInboxQuery, useUpdateInboxStatusMutation } from "@/slices/agentApiSlice";
import { Loader2, Filter } from "lucide-react";
import { toast } from "sonner";

/* Small UI helpers */
const statusBadge = (s) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1";
  switch (s) {
    case "queued":
      return `${base} bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20`;
    case "in_progress":
      return `${base} bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/20`;
    case "done":
      return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20`;
    default:
      return `${base} bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:ring-neutral-600/30`;
  }
};

const pillBtnBase =
  "rounded-full px-3 py-1 text-xs font-medium transition-colors border ring-1 disabled:opacity-60 disabled:cursor-not-allowed";
const pillStyles = {
  queued:
    `${pillBtnBase} border-amber-300 ring-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/40 dark:ring-amber-400/20 dark:hover:bg-amber-500/20`,
  in_progress:
    `${pillBtnBase} border-blue-300 ring-blue-200 text-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/40 dark:ring-blue-400/20 dark:hover:bg-blue-500/20`,
  done:
    `${pillBtnBase} border-emerald-300 ring-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/40 dark:ring-emerald-400/20 dark:hover:bg-emerald-500/20`,
};

export default function AdminInboxPage() {
  const [status, setStatus] = useState("");
  const { data, isLoading, refetch, isFetching } = useGetInboxQuery({
    page: 1,
    limit: 50,
    status,
  });
  const [updateStatus, { isLoading: updating }] = useUpdateInboxStatusMutation();

  const items = data?.items || [];

  async function onChangeStatus(id, next) {
    try {
      await updateStatus({ id, status: next }).unwrap();
      toast.success("Status updated");
      refetch();
    } catch (e) {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      {/* Header / Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Agent Inbox
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Messages captured while live support is offline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none rounded-xl border border-neutral-300 pl-8 pr-8 py-2 text-sm bg-white text-neutral-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-blue-500"
            >
              <option value="">All statuses</option>
              <option value="queued">Queued</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {(isLoading || isFetching) && (
            <span className="inline-flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Time</th>
              <th className="px-4 py-3 text-left font-semibold">Room</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Question</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {items.map((it) => (
              <tr key={it._id} className="text-neutral-800 dark:text-neutral-200">
                <td className="px-4 py-3 whitespace-nowrap text-xs text-neutral-600 dark:text-neutral-400">
                  {new Date(it.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-[11px]">{it.room}</td>
                <td className="px-4 py-3">
                  <a
                    href={`mailto:${it.email}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {it.email}
                  </a>
                </td>
                <td
                  className="px-4 py-3 max-w-[520px] truncate"
                  title={it.question}
                >
                  {it.question}
                </td>
                <td className="px-4 py-3">
                  <span className={statusBadge(it.status)}>{it.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onChangeStatus(it._id, "queued")}
                      className={pillStyles.queued}
                      disabled={updating}
                      aria-label="Mark as queued"
                    >
                      {updating ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Queued
                        </span>
                      ) : (
                        "Queued"
                      )}
                    </button>
                    <button
                      onClick={() => onChangeStatus(it._id, "in_progress")}
                      className={pillStyles.in_progress}
                      disabled={updating}
                      aria-label="Mark as in progress"
                    >
                      {updating ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> In&nbsp;Progress
                        </span>
                      ) : (
                        "In Progress"
                      )}
                    </button>
                    <button
                      onClick={() => onChangeStatus(it._id, "done")}
                      className={pillStyles.done}
                      disabled={updating}
                      aria-label="Mark as done"
                    >
                      {updating ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Done
                        </span>
                      ) : (
                        "Done"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && !isLoading && (
              <tr>
                <td
                  className="px-4 py-10 text-center text-neutral-500 dark:text-neutral-400"
                  colSpan={6}
                >
                  No inbox items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
