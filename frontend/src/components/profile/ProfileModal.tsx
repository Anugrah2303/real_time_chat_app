import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Avatar from "../common/Avatar";
import { uploadFile } from "../../api/message.api";
import { updateProfile } from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";
import { IMAGE_FILE_TYPES, MAX_FILE_SIZE } from "../../utils/constants";
import { formatFileSize, getErrorMessage } from "../../utils/format";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setProfileImage(user.profileImage);
    }
  }, [open, user]);

  const trimmed = name.trim();
  const nameError = trimmed.length < 2 || trimmed.length > 50 ? "Name must be 2-50 characters" : undefined;

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!IMAGE_FILE_TYPES.includes(file.type)) {
      toast.error("Please choose a png, jpeg, webp or gif image");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Image too large (max ${formatFileSize(MAX_FILE_SIZE)})`);
      return;
    }
    setIsUploading(true);
    uploadFile(file)
      .then((result) => setProfileImage(result.url))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsUploading(false));
  };

  const save = () => {
    if (nameError || isSaving || isUploading) return;
    setIsSaving(true);
    updateProfile({ name: trimmed, profileImage })
      .then((result) => {
        updateUser({ name: result.name, profileImage: result.profileImage });
        toast.success("Profile updated");
        onClose();
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsSaving(false));
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit profile">
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <Avatar name={name || user?.name || "?"} src={profileImage} size="xl" />
          <input
            ref={fileRef}
            type="file"
            accept={IMAGE_FILE_TYPES.join(",")}
            onChange={onFileChange}
            className="hidden"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Camera size={16} />}
              isLoading={isUploading}
              onClick={() => fileRef.current?.click()}
            >
              Change photo
            </Button>
            {profileImage && (
              <Button variant="ghost" size="sm" onClick={() => setProfileImage("")} disabled={isUploading}>
                Remove
              </Button>
            )}
          </div>
        </div>
        <Input
          label="Name"
          value={name}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          error={name && nameError ? nameError : undefined}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={save} isLoading={isSaving} disabled={!!nameError || isUploading}>
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
