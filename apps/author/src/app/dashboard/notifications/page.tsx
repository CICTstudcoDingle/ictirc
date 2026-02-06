import { Bell, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ictirc/ui";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">
          Stay updated on your submission progress
        </p>
      </div>

      {/* Coming Soon Notice */}
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Email notifications for paper status updates, reviewer feedback, and 
              publication announcements will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">In the meantime</h4>
              <p className="text-sm text-blue-700 mt-1">
                Check your paper status in the &quot;My Papers&quot; section. 
                Status updates are reflected in real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
