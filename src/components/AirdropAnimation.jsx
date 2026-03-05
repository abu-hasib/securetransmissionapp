import { motion } from "framer-motion";
import { FolderArchive, MonitorCheck } from "lucide-react";

export default function AirDropAnimation() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "300px",
        padding: "50px",
      }}
    >
      {/* Sender */}
      <div style={{ width: 50, height: 50, background: "blue" }}>📦</div>

      {/* File/Object being transferred */}
      <motion.div
        style={{
          width: 30,
          height: 30,
          background: "red",
          position: "absolute",
        }}
        animate={{ x: 200, opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Receiver */}
      <div style={{ width: 50, height: 50, background: "green" }}>📥</div>
    </div>
  );
}
