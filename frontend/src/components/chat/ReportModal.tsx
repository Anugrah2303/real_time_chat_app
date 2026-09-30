import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { createReport } from "../../api/report.api";
import { MAX_REASON_LENGTH } from "../../utils/constants";
import { getErrorMessage } from "../../utils/format";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  reportedUserId: string;
  messageId?: string;
  title: string;
}

const ReportModal = ({ open, onClose, reportedUserId, messageId, title }: ReportModalProps) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const trimmed = reason.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= MAX_REASON_LENGTH;

  const submit = () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    createReport({ reportedUserId, messageId, reason: trimmed })
      .then(() => {
        toast.success("Report submitted");
        onClose();
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            maxLength={MAX_REASON_LENGTH}
            placeholder="Tell us what is wrong"
            className="w-full resize-none rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500"
          />
          <p className="mt-1 text-right text-xs text-ink-500">
            {trimmed.length}/{MAX_REASON_LENGTH}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={submit} isLoading={isSubmitting} disabled={!isValid}>
            Submit report
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportModal;
