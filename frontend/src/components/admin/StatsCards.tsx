import { Flag, MessageSquare, ShieldOff, Users, Wifi } from "lucide-react";
import Card from "../ui/Card";
import type { AdminStats } from "../../types";

interface StatsCardsProps {
  stats: AdminStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const items = [
    { label: "Users", value: stats.users, icon: <Users size={20} /> },
    { label: "Online now", value: stats.online, icon: <Wifi size={20} /> },
    { label: "Blocked", value: stats.blocked, icon: <ShieldOff size={20} /> },
    { label: "Messages", value: stats.messages, icon: <MessageSquare size={20} /> },
    { label: "Open reports", value: stats.openReports, icon: <Flag size={20} /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label}>
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-ink-900">{item.value}</p>
              <p className="truncate text-xs text-ink-500">{item.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
