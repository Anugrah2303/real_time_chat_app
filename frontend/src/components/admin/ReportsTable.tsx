import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { MessageType, ReportStatus, type AdminReport } from "../../types";
import { formatDateTime } from "../../utils/format";

interface ReportsTableProps {
  reports: AdminReport[];
  busyId: string | null;
  onResolve: (report: AdminReport) => void;
}

const getPreview = (report: AdminReport) => {
  const message = report.messageId;
  if (!message) return "-";
  if (message.deleted) return "Deleted message";
  if (message.messageType === MessageType.IMAGE) return "Photo";
  if (message.messageType === MessageType.FILE) return "File";
  return message.content.length > 80 ? `${message.content.slice(0, 80)}...` : message.content;
};

const ReportsTable = ({ reports, busyId, onResolve }: ReportsTableProps) => {
  return (
    <Card>
      <div className="border-b border-ink-100 px-4 py-3">
        <h2 className="font-display text-lg font-bold text-ink-900">Reports</h2>
      </div>
      {reports.length === 0 ? (
        <EmptyState title="No reports" description="User reports will appear here" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Reporter</th>
                <th className="px-4 py-3 font-medium">Reported user</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {reports.map((r) => {
                const open = r.status === ReportStatus.OPEN;
                return (
                  <tr key={r._id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-900">{r.reporterId?.name ?? "Unknown"}</p>
                      <p className="text-xs text-ink-500">{r.reporterId?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-900">{r.reportedUserId?.name ?? "Unknown"}</p>
                      <p className="text-xs text-ink-500">{r.reportedUserId?.email}</p>
                    </td>
                    <td className="max-w-[16rem] break-words px-4 py-3 text-ink-700">{r.reason}</td>
                    <td className="max-w-[16rem] break-words px-4 py-3 text-ink-700">{getPreview(r)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={open ? "amber" : "green"}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-700">{formatDateTime(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {open && (
                        <Button
                          size="sm"
                          variant="outline"
                          isLoading={busyId === r._id}
                          disabled={busyId !== null}
                          onClick={() => onResolve(r)}
                        >
                          Resolve
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default ReportsTable;
