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
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Overview</h3>
      
      <div className="mb-4">
        <div className="flex h-8 rounded-lg overflow-hidden shadow-sm">
          {data.paid > 0 && (
            <div
              className="bg-green-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${paidPercent}%` }}
              title={`Paid: ₹${data.paid.toLocaleString()}`}
            >
              {paidPercent > 10 && `${paidPercent.toFixed(0)}%`}
            </div>
          )}
          {data.pending > 0 && (
            <div
              className="bg-yellow-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${pendingPercent}%` }}
              title={`Pending: ₹${data.pending.toLocaleString()}`}
            >
              {pendingPercent > 10 && `${pendingPercent.toFixed(0)}%`}
            </div>
          )}
          {data.overdue > 0 && (
            <div
              className="bg-red-500 flex items-center justify-center text-white text-xs font-semibold"
              style={{ width: `${overduePercent}%` }}
              title={`Overdue: ₹${data.overdue.toLocaleString()}`}
            >
              {overduePercent > 10 && `${overduePercent.toFixed(0)}%`}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Paid</span>
          </div>
          <p className="text-lg font-bold text-green-600">₹{(data.paid / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500">{paidPercent.toFixed(0)}%</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <p className="text-lg font-bold text-yellow-600">₹{(data.pending / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500">{pendingPercent.toFixed(0)}%</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-600">Overdue</span>
          </div>
          <p className="text-lg font-bold text-red-600">₹{(data.overdue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500">{overduePercent.toFixed(0)}%</p>
        </div>
      </div>
    </Card>
  );
}
