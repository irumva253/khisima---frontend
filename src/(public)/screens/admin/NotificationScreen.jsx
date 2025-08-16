import React from 'react';
import { Bell, Check, X, Clock, AlertCircle, Mail, Calendar, ShieldAlert, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotificationScreen = () => {
  // Sample notification data
  const notifications = [
    {
      id: 1,
      title: "New message received",
      description: "You have a new message from Sarah Williams about the project deadline.",
      time: "10 minutes ago",
      read: false,
      type: "message"
    },
    {
      id: 2,
      title: "Meeting reminder",
      description: "Team sync meeting starts in 15 minutes. Don't forget to join!",
      time: "1 hour ago",
      read: true,
      type: "reminder"
    },
    {
      id: 3,
      title: "System update",
      description: "A new version of the app is available. Update now for new features.",
      time: "3 hours ago",
      read: false,
      type: "system"
    },
    {
      id: 4,
      title: "Payment processed",
      description: "Your subscription payment of $9.99 has been processed successfully.",
      time: "Yesterday",
      read: true,
      type: "payment"
    },
    {
      id: 5,
      title: "Warning: Storage limit",
      description: "You've used 85% of your storage. Upgrade your plan for more space.",
      time: "Yesterday",
      read: false,
      type: "alert"
    }
  ];

  const getIcon = (type) => {
    switch(type) {
      case "message":
        return <Mail className="h-4 w-4 text-blue-500" />;
      case "reminder":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "system":
        return <ShieldAlert className="h-4 w-4 text-green-500" />;
      case "payment":
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Notifications
        </h1>
        <Button variant="ghost" className="text-sm">
          Mark all as read
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notification
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notifications.map((notification) => (
              <tr 
                key={notification.id} 
                className={!notification.read ? "bg-blue-50" : ""}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${!notification.read ? "text-gray-900 font-semibold" : "text-gray-700"}`}>
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {notification.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{notification.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Check className="h-3 w-3 mr-1" />
                      <span>Dismiss</span>
                    </Button>
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <X className="h-3 w-3 mr-1" />
                        <span>Mark read</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Button variant="outline">
          Load more notifications
        </Button>
      </div>
    </div>
  );
};

export default NotificationScreen;