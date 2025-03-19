<?php

namespace App\Http\Controllers;

use App\Models\MonthlyInvoice;
use Illuminate\Http\Request;

class MonthlyInvoiceController extends Controller
{
    // Store Monthly Invoice
    public function store(Request $request)
    {
        $request->validate([
            'month_total' => 'required|numeric',
            'month_target' => 'required|numeric',
        ]);

        $invoice = MonthlyInvoice::create([
            'month_total' => $request->month_total,
            'month_target' => $request->month_target,
        ]);

        return response()->json($invoice, 201);
    }

        public function getLatestMonthTotal()
    {
        $latestInvoice = MonthlyInvoice::latest('created_at')->first();

        if (!$latestInvoice) {
            return response()->json(['message' => 'No monthly invoices found'], 404);
        }

        return response()->json([
            'latest_month_total' => $latestInvoice->month_total,
        ]);
    }

        public function getLatestMonthTarget()
    {
        $latestInvoice = MonthlyInvoice::latest('created_at')->first();

        if (!$latestInvoice) {
            return response()->json(['message' => 'No monthly invoices found'], 404);
        }

        return response()->json([
            'latest_month_target' => $latestInvoice->month_target,
        ]);
    }
    // Add Monthly Invoice
    public function sumAmount(Request $request)
    {
        $request->validate([
            'month_total' => 'required|numeric',
        ]);

        $latestInvoice = MonthlyInvoice::latest('created_at')->first();

        if (!$latestInvoice) {
            return response()->json(['message' => 'No invoices found'], 404);
        }

        $newMonthTotal = $latestInvoice->month_total + $request->month_total;

        $latestInvoice->update([
            'month_total' => $newMonthTotal
        ]);

        return response()->json([
            'message' => 'Month total updated successfully',
            'new_month_total' => $newMonthTotal,
            'invoice' => $latestInvoice
        ]);
    }
    // Show all Invoices
    public function index()
    {
        $invoices = MonthlyInvoice::all();

        return response()->json($invoices);
    }

    public function show($id)
    {
        $invoice = MonthlyInvoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        return response()->json($invoice);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'month_total' => 'required|numeric',
            'month_target' => 'required|numeric',
        ]);

        $invoice = MonthlyInvoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        $invoice->update([
            'month_total' => $request->month_total,
            'month_target' => $request->month_target,
        ]);

        return response()->json($invoice);
    }
    // Delete Invoices
    public function destroy($id)
    {
        $invoice = MonthlyInvoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        $invoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }

        public function calculateRevenueByMonth()
    {
        $monthlyRevenue = MonthlyInvoice::selectRaw('MONTH(created_at) as month, SUM(month_total) as month_total')
            ->whereYear('created_at', date('Y')) // Filter only current year data
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Convert month numbers (1-12) to names (January-December)
        $formattedRevenue = [];

        for ($i = 1; $i <= 12; $i++) {
            $formattedRevenue[] = [
                'month' => date('F', mktime(0, 0, 0, $i, 1)),
                'month_total' => $monthlyRevenue->where('month', $i)->first()->month_total ?? 0
            ];
        }

        return response()->json($formattedRevenue);
    }
    public function getCurrentMonthTotal()
{
    $currentMonthTotal = MonthlyInvoice::whereYear('created_at', date('Y'))
        ->whereMonth('created_at', date('m'))
        ->sum('month_total');

    return response()->json([
        'current_month_total' => $currentMonthTotal,
    ]);
}
}


