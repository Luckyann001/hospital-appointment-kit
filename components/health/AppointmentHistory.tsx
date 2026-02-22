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
    <Card>
      <h2 className="text-xl font-semibold text-slate-900">
        {role === "provider" ? "Provider Schedule View" : "My Appointments"}
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No appointments yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Provider</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                {role === "provider" ? (
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Patient ID</th>
                ) : null}
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {new Date(item.appointmentDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.providerName}</td>
                  <td className="px-4 py-3 text-slate-700">{item.appointmentType}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {item.status}
                    </span>
                  </td>
                  {role === "provider" ? (
                    <td className="px-4 py-3 text-slate-700">{item.patientId}</td>
                  ) : null}
                  <td className="px-4 py-3 text-slate-700">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
