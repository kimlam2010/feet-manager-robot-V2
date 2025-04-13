'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePermissions } from '@/hooks/usePermissions';

export default function SettingsPage() {
  const { can } = usePermissions();
  const [systemName, setSystemName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Settings Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Name
              </label>
              <input
                type="text"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="Enter system name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Zone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>UTC</option>
                {/* Add more timezone options */}
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="pushNotifications"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="pushNotifications" className="ml-2 text-sm text-gray-700">
                Push Notifications
              </label>
            </div>
          </div>
        </div>

        {/* Audit Logs Card - Only visible to admin */}
        {can('manage_settings') && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">System Logs</h2>
            <p className="text-gray-600 mb-4">
              View system activity and audit logs to track changes and monitor system usage.
            </p>
            <Link
              href="/settings/audit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View Audit Logs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 