import { useState } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import getCroppedImg from "../../Utils/getCroppedImg";

const ImageCropper = ({
  open,
  image,
  onClose,
  onComplete,
  currentIndex = 1,
  totalFiles = 1,
  fileName = "image",
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = (_, area) => setCroppedAreaPixels(area);

  const handleConfirm = async () => {
    if (!croppedAreaPixels || isProcessing) return;

    setIsProcessing(true);
    try {
      const croppedFile = await getCroppedImg(image, croppedAreaPixels);
      onComplete(croppedFile);
    } catch (error) {
      console.error("Error cropping image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography variant="h6">Crop Image</Typography>
          <Typography variant="body2" color="textSecondary">
            {currentIndex} of {totalFiles} - {fileName}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent className="h-[500px] relative p-0">
        {/* <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropSize={{ width: 380, height: 500 }}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        /> */}
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
        ;
      </DialogContent>
      <DialogActions>
        <Button
          className="!bg-primary !text-white"
          onClick={handleClose}
          disabled={isProcessing}
        >
          Cancel All
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          className="!bg-green-500"
          disabled={!croppedAreaPixels || isProcessing}
        >
          {isProcessing
            ? "Processing..."
            : totalFiles > 1
              ? currentIndex < totalFiles
                ? "Next Image"
                : "Finish"
              : "Crop"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper;
