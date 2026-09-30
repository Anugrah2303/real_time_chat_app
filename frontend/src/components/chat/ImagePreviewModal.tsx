import Modal from "../ui/Modal";

interface ImagePreviewModalProps {
  src: string | null;
  name: string;
  onClose: () => void;
}

const ImagePreviewModal = ({ src, name, onClose }: ImagePreviewModalProps) => {
  return (
    <Modal open={!!src} onClose={onClose} title={name || "Image"}>
      {src && <img src={src} alt={name} className="mx-auto max-h-[70vh] w-auto max-w-full rounded-xl object-contain" />}
    </Modal>
  );
};

export default ImagePreviewModal;
