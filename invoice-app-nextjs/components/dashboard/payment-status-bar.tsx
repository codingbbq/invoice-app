'use client';

import { Card } from '@/components/ui/card';

export interface PaymentStatusData {
  paid: number;
  pending: number;
  overdue: number;
}

export function PaymentStatusBar({ data }: { data: PaymentStatusData }) {
  const total = data.paid + data.pending + data.overdue;
  const paidPercent = total > 0 ? (data.paid / total) * 100 : 0;
  const pendingPercent = total > 0 ? (data.pending / total) * 100 : 0;
  const overduePercent = total > 0 ? (data.overdue / total) * 100 : 0;

  return (
    <Card className="p-4 mb-6 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Status</h3>
      
      <div className="mb-3">
        <div className="flex h-6 rounded-md overflow-hidden bg-gray-100">
          {data.paid > 0 && (
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${paidPercent}%` }}
              title={`Paid: ₹${data.paid.toLocaleString()}`}
            >
              {paidPercent > 15 && `${paidPercent.toFixed(0)}%`}
            </div>
          )}
          {data.pending > 0 && (
            <div
              className="bg-amber-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${pendingPercent}%` }}
              title={`Pending: ₹${data.pending.toLocaleString()}`}
            >
              {pendingPercent > 15 && `${pendingPercent.toFixed(0)}%`}
            </div>
          )}
          {data.overdue > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${overduePercent}%` }}
              title={`Overdue: ₹${data.overdue.toLocaleString()}`}
            >
              {overduePercent > 15 && `${overduePercent.toFixed(0)}%`}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-gray-600">Paid</span>
          </div>
          <p className="text-sm font-bold text-gray-900">₹{(data.paid / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-400">{paidPercent.toFixed(0)}%</p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <span className="text-xs font-medium text-gray-600">Pending</span>
          </div>
          <p className="text-sm font-bold text-gray-900">₹{(data.pending / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-400">{pendingPercent.toFixed(0)}%</p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <span className="text-xs font-medium text-gray-600">Overdue</span>
          </div>
          <p className="text-sm font-bold text-gray-900">₹{(data.overdue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-400">{overduePercent.toFixed(0)}%</p>
        </div>
      </div>
    </Card>
  );
}
