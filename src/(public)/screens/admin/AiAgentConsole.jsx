import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Inbox, Shield, TerminalSquare } from 'lucide-react';

import AdminAiAgentConsole from './AdminAiAgentConsole';
import AdminInboxPage from './AdminInboxPage';

const AIAgentConsole = () => {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') || 'console').toLowerCase();

  const setTab = (next) => {
    const p = new URLSearchParams(params);
    p.set('tab', next);
    setParams(p, { replace: true });
  };

  const isConsole = tab === 'console';
  const isInbox = tab === 'inbox';

  return (
   <div className="w-full p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm dark:bg-blue-500">
            <TerminalSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-tight">AI Agent</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Manage live conversations and follow-up inbox in one place.
            </p>
          </div>
        </div>

        {/* Quick tips / status area (purely visual, you can wire up real status) */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <Shield className="h-4 w-4" />
            Admin Only
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => setTab('console')}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors
            ${isConsole
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'}`}
          aria-current={isConsole ? 'page' : undefined}
        >
          <MessageSquare className="h-4 w-4" />
          Live Console
        </button>

        <button
          onClick={() => setTab('inbox')}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors
            ${isInbox
              ? 'bg-blue-600 text-white dark:bg-blue-500'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'}`}
          aria-current={isInbox ? 'page' : undefined}
        >
          <Inbox className="h-4 w-4" />
          Inbox
        </button>
      </div>

      {/* Body */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isConsole && <AdminAiAgentConsole />}
        {isInbox && <AdminInboxPage />}
      </div>
    </div>
  )
}

export default AIAgentConsole
