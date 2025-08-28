import React, { useState } from "react";
import { Booking } from "../types/types";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";

interface AdminBookingModalProps {
  booking: Booking;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (status: "confirmed" | "cancelled" | "completed", reason?: string) => void;
}

const AdminBookingModal: React.FC<AdminBookingModalProps> = ({ booking, open, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState<"confirmed" | "cancelled" | "completed">(booking.status);
  const [reason, setReason] = useState<string>(booking.cancellationReason || "");

  const handleSave = () => {
    onUpdateStatus(status, status === "cancelled" ? reason : undefined);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage Booking</DialogTitle>
      <DialogContent style={{ minWidth: 350 }}>
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "confirmed" | "cancelled" | "completed")}
          fullWidth
          margin="normal"
        >
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>

        {status === "cancelled" && (
          <TextField
            label="Cancellation Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            margin="normal"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminBookingModal;
