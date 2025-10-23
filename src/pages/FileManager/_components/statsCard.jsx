import { Card, CardContent } from "@/components/ui/card";

const StatsCard = ({ icon: Icon, label, value, subtitle }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{label}</span>
        <div className="bg-gray-100 p-1 w-6 rounded-sm">
          <Icon className="w-4 h-4 text-gray-700" />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{subtitle}</div>
    </CardContent>
  </Card>
);

export default StatsCard;
