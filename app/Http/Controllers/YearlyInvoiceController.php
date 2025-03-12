<?php

namespace App\Http\Controllers;

use App\Models\YearlyInvoice;
use Illuminate\Http\Request;

class YearlyInvoiceController extends Controller
{

        public function getLatestYearTotal()
    {
        // Get the most recent yearly invoice (latest record based on created_at)
        $latestInvoice = YearlyInvoice::latest('created_at')->first();

        // If no invoice is found, return an error message
        if (!$latestInvoice) {
            return response()->json(['message' => 'No yearly invoices found'], 404);
        }

        // Return the latest year_total
        return response()->json([
            'latest_year_total' => $latestInvoice->year_total,
        ]);
    }

        public function getLatestYearTarget()
    {
        // Get the most recent yearly invoice (latest record based on created_at)
        $latestInvoice = YearlyInvoice::latest('created_at')->first();

        // If no invoice is found, return an error message
        if (!$latestInvoice) {
            return response()->json(['message' => 'No yearly invoices found'], 404);
        }

        // Return the latest year_target
        return response()->json([
            'latest_year_target' => $latestInvoice->year_target,
        ]);
    }
    // Function to sum year_total for the most recent yearly invoice
    public function sumAmount(Request $request)
    {
        // Validate the incoming request for year_total
        $request->validate([
            'year_total' => 'required|numeric',
        ]);

        // Get the most recent yearly invoice (latest record based on created_at)
        $latestInvoice = YearlyInvoice::latest('created_at')->first();

        // If there is no invoice, return an error message
        if (!$latestInvoice) {
            return response()->json(['message' => 'No invoices found'], 404);
        }

        // Sum the year_total input with the latest invoice's year_total
        $newYearTotal = $latestInvoice->year_total + $request->year_total;

        // Update the latest invoice with the new summed amount
        $latestInvoice->update([
            'year_total' => $newYearTotal
        ]);

        // Return the updated invoice data along with a success message
        return response()->json([
            'message' => 'Year total updated successfully',
            'new_year_total' => $newYearTotal,
            'invoice' => $latestInvoice // Optionally include the updated invoice
        ]);
    }

    // Function to create a new yearly invoice
    public function store(Request $request)
    {
        // Validate the incoming data
        $request->validate([
            'year_total' => 'required|numeric',
            'year_target' => 'required|numeric',
        ]);

        // Create a new yearly invoice with the given data
        $invoice = YearlyInvoice::create([
            'year_total' => $request->year_total,
            'year_target' => $request->year_target,
        ]);

        // Return the created invoice as a response
        return response()->json($invoice, 201);
    }

    // Function to list all yearly invoices
    public function index()
    {
        // Retrieve all yearly invoices
        $invoices = YearlyInvoice::all();

        // Return the list of invoices
        return response()->json($invoices);
    }

    // Function to show a single yearly invoice
    public function show($id)
    {
        // Find the yearly invoice by its ID
        $invoice = YearlyInvoice::find($id);

        // If invoice not found, return an error
        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        // Return the invoice
        return response()->json($invoice);
    }

    // Function to update an existing yearly invoice
    public function update(Request $request, $id)
    {
        // Validate the incoming data
        $request->validate([
            'year_total' => 'required|numeric',
            'year_target' => 'required|numeric',
        ]);

        // Find the yearly invoice by its ID
        $invoice = YearlyInvoice::find($id);

        // If invoice not found, return an error
        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        // Update the invoice with the new data
        $invoice->update([
            'year_total' => $request->year_total,
            'year_target' => $request->year_target,
        ]);

        // Return the updated invoice
        return response()->json($invoice);
    }

    // Function to delete a yearly invoice
    public function destroy($id)
    {
        // Find the yearly invoice by its ID
        $invoice = YearlyInvoice::find($id);

        // If invoice not found, return an error
        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        // Delete the invoice
        $invoice->delete();

        // Return a success message
        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}
