import { useEffect, useState } from "react";
import { getHealth } from "./services/api";

export default function App() {
  const [status, setStatus] = useState("checking...");
  useEffect(() => {
    getHealth().then(d => setStatus(d.status)).catch(() => setStatus("failed"));
  }, []);
  return (
    <div className="min-h-screen bg-[#08090F] text-[#00D9FF] grid place-items-center text-3xl">
      API: {status}
    </div>
  );
}