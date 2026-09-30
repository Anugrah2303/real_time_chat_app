import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { UserStatus, type AdminUser } from "../../types";
import { formatDateTime } from "../../utils/format";

interface UsersTableProps {
  users: AdminUser[];
  busyId: string | null;
  onToggle: (user: AdminUser) => void;
}

const UsersTable = ({ users, busyId, onToggle }: UsersTableProps) => {
  return (
    <Card>
      <div className="border-b border-ink-100 px-4 py-3">
        <h2 className="font-display text-lg font-bold text-ink-900">Users</h2>
      </div>
      {users.length === 0 ? (
        <EmptyState title="No users yet" description="Registered users will appear here" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last seen</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {users.map((u) => {
                const blocked = u.status === UserStatus.BLOCKED;
                return (
                  <tr key={u._id}>
                    <td className="px-4 py-3 font-medium text-ink-900">{u.name}</td>
                    <td className="px-4 py-3 text-ink-700">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge tone={blocked ? "red" : "green"}>{u.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-ink-700">{formatDateTime(u.lastSeen)}</td>
                    <td className="px-4 py-3 text-ink-700">{formatDateTime(u.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant={blocked ? "outline" : "danger"}
                        isLoading={busyId === u._id}
                        disabled={busyId !== null}
                        onClick={() => onToggle(u)}
                      >
                        {blocked ? "Unblock" : "Block"}
                      </Button>
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

export default UsersTable;
