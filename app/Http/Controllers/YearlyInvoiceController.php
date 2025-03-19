<?php

namespace App\Http\Controllers;

use App\Models\YearlyInvoice;
use Illuminate\Http\Request;

class YearlyInvoiceController extends Controller
{

        // Get the lateast year Invoice
        public function getLatestYearTotal()
    {
        $latestInvoice = YearlyInvoice::latest('created_at')->first();

        if (!$latestInvoice) {
            return response()->json(['message' => 'No yearly invoices found'], 404);
        }

        return response()->json([
            'latest_year_total' => $latestInvoice->year_total,
        ]);
    }

        public function getLatestYearTarget()
    {
        $latestInvoice = YearlyInvoice::latest('created_at')->first();
        if (!$latestInvoice) {
            return response()->json(['message' => 'No yearly invoices found'], 404);
        }
        return response()->json([
            'latest_year_target' => $latestInvoice->year_target,
        ]);
    }

    // Add  year Invoice
    public function sumAmount(Request $request)
    {
        $request->validate([
            'year_total' => 'required|numeric',
        ]);
        $latestInvoice = YearlyInvoice::latest('created_at')->first();

        if (!$latestInvoice) {
            return response()->json(['message' => 'No invoices found'], 404);
        }

        $newYearTotal = $latestInvoice->year_total + $request->year_total;

        $latestInvoice->update([
            'year_total' => $newYearTotal
        ]);

        return response()->json([
            'message' => 'Year total updated successfully',
            'new_year_total' => $newYearTotal,
            'invoice' => $latestInvoice
        ]);
    }
    // Store/put the yearly invoice
    public function store(Request $request)
    {
        $request->validate([
            'year_total' => 'required|numeric',
            'year_target' => 'required|numeric',
        ]);

        $invoice = YearlyInvoice::create([
            'year_total' => $request->year_total,
            'year_target' => $request->year_target,
        ]);
        return response()->json($invoice, 201);
    }
    // Show all the year invoices
    public function index()
    {
        $invoices = YearlyInvoice::all();

        return response()->json($invoices);
    }

    public function show($id)
    {
        $invoice = YearlyInvoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        return response()->json($invoice);
    }
    // update the year invoice
    public function update(Request $request, $id)
    {

        $request->validate([
            'year_total' => 'required|numeric',
            'year_target' => 'required|numeric',
        ]);

        $invoice = YearlyInvoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }
        $invoice->update([
            'year_total' => $request->year_total,
            'year_target' => $request->year_target,
        ]);

        return response()->json($invoice);
    }

    public function destroy($id)
    {
        $invoice = YearlyInvoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted successfully']);
    }
    
    public function dashboardYear()
    {
        // Get the current year
        $currentYear = now()->year;
    
        // Create an array to hold the totals for the last 6 years
        $yearlyTotals = [];
    
        // Loop through the last 6 years (current year and 5 previous years)
        for ($i = 0; $i < 6; $i++) {
            $year = $currentYear - $i;
    
            // Get the total for all invoices in this year
            $total = YearlyInvoice::whereYear('created_at', $year)
                        ->sum('year_total'); // Summing all 'year_total' values for the year
    
            // Add the result to the array
            $yearlyTotals[] = [
                'year' => $year,
                'total' => $total ?: 0  // If no invoices found, set total as 0
            ];
        }
    
        // Return the yearly totals as a JSON response
        return response()->json($yearlyTotals);
    }
}
