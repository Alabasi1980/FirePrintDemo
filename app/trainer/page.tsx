import React from "react";
import Link from "next/link";
import {
  Users,
  Activity,
  BookOpen,
  Settings,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              TM
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">
              Trainer Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Student View
            </Link>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
              S
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Trainer Dashboard
          </h1>
          <p className="text-slate-500">
            Monitor your students&apos; progress and assign targeted remedial
            lessons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium">
                  Active Students
                </div>
                <div className="text-3xl font-bold text-slate-800">24</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium">
                  Class Avg Accuracy
                </div>
                <div className="text-3xl font-bold text-slate-800">94%</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-slate-500 font-medium">
                  Needs Remedial
                </div>
                <div className="text-3xl font-bold text-slate-800">3</div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Student Roster
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Student Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Current Unit
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Avg WPM
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Avg Accuracy
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  name: "Alex Johnson",
                  unit: "Unit 2",
                  wpm: 28,
                  acc: 96,
                  status: "On Track",
                },
                {
                  name: "Maria Garcia",
                  unit: "Unit 3",
                  wpm: 42,
                  acc: 98,
                  status: "Excelling",
                },
                {
                  name: "James Smith",
                  unit: "Unit 1",
                  wpm: 12,
                  acc: 88,
                  status: "Needs Help",
                },
              ].map((student, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{student.unit}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono">
                    {student.wpm}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">
                    {student.acc}%
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === "On Track"
                          ? "bg-blue-100 text-blue-700"
                          : student.status === "Excelling"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
