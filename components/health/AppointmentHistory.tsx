"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";

type Appointment = {
  id: string;
  patientId: string;
  providerName: string;
  appointmentDate: string;
  appointmentType: "in_person" | "telehealth";
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
};

type Props = {
  role: "patient" | "provider";
  patientId: string;
  requestHeaders: Record<string, string>;
  refreshToken: number;
};

export default function AppointmentHistory({ role, patientId, requestHeaders, refreshToken }: Props) {
  const [items, setItems] = useState<Appointment[]>([]);

  useEffect(() => {
    const query =
      role === "provider"
        ? "/api/health/appointments?role=provider"
        : `/api/health/appointments?role=patient&patientId=${encodeURIComponent(patientId)}`;

    fetch(query, { headers: requestHeaders })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.appointments ?? []);
      })
      .catch(() => setItems([]));
  }, [role, patientId, refreshToken, requestHeaders]);

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-4xl font-semibold text-slate-900">Recent Activity</h2>
      <p className="mt-1 text-xl text-slate-500">Latest operations and appointments</p>

      {items.length === 0 ? (
        <p className="mt-5 text-base text-slate-500">No appointments yet.</p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Visit Type</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                {role === "provider" ? <th className="px-4 py-3 font-semibold">Patient ID</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-4 py-3">{new Date(item.appointmentDate).toLocaleString()}</td>
                  <td className="px-4 py-3">{item.providerName}</td>
                  <td className="px-4 py-3">{item.appointmentType === "in_person" ? "In-person" : "Telehealth"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {item.status}
                    </span>
                  </td>
                  {role === "provider" ? <td className="px-4 py-3">{item.patientId}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
