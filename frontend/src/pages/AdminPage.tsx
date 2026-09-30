import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StatsCards from "../components/admin/StatsCards";
import UsersTable from "../components/admin/UsersTable";
import ReportsTable from "../components/admin/ReportsTable";
import Loader from "../components/ui/Loader";
import {
  getAdminReports,
  getAdminStats,
  getAdminUsers,
  resolveReport,
  toggleBlockUser,
} from "../api/admin.api";
import { ReportStatus, UserStatus, type AdminReport, type AdminStats, type AdminUser } from "../types";
import { getErrorMessage } from "../utils/format";

const AdminPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [busyReportId, setBusyReportId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminUsers(), getAdminReports()])
      .then(([s, u, r]) => {
        setStats(s);
        setUsers(u);
        setReports(r);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggle = (target: AdminUser) => {
    setBusyUserId(target._id);
    toggleBlockUser(target._id)
      .then(({ status }) => {
        setUsers((prev) => prev.map((u) => (u._id === target._id ? { ...u, status } : u)));
        setStats((prev) =>
          prev ? { ...prev, blocked: Math.max(0, prev.blocked + (status === UserStatus.BLOCKED ? 1 : -1)) } : prev
        );
        toast.success(status === UserStatus.BLOCKED ? "User blocked" : "User unblocked");
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setBusyUserId(null));
  };

  const handleResolve = (target: AdminReport) => {
    setBusyReportId(target._id);
    resolveReport(target._id)
      .then(() => {
        setReports((prev) => prev.map((r) => (r._id === target._id ? { ...r, status: ReportStatus.RESOLVED } : r)));
        setStats((prev) => (prev ? { ...prev, openReports: Math.max(0, prev.openReports - 1) } : prev));
        toast.success("Report resolved");
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setBusyReportId(null));
  };

  if (isLoading) return <Loader label="Loading dashboard" />;

  return (
    <div className="container-page space-y-6 py-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Admin dashboard</h1>
        <p className="text-sm text-ink-500">Manage users and review reports</p>
      </div>
      {stats && <StatsCards stats={stats} />}
      <UsersTable users={users} busyId={busyUserId} onToggle={handleToggle} />
      <ReportsTable reports={reports} busyId={busyReportId} onResolve={handleResolve} />
    </div>
  );
};

export default AdminPage;
