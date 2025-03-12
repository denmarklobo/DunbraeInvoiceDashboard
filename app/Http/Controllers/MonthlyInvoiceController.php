<?php

namespace App\Http\Controllers;

use App\Models\MonthlyInvoice;
use Illuminate\Http\Request;

class MonthlyInvoiceController extends Controller
{
    // Store a newly created invoice
    public function store(Request $request)
    {
        // Validate the incoming data
        $request->validate([
            'month_total' => 'required|numeric',
            'month_target' => 'required|numeric',
        ]);

        // Create a new monthly invoice with the given data
        $invoice = MonthlyInvoice::create([
            'month_total' => $request->month_total,
            'month_target' => $request->month_target,
        ]);

        // Return the created invoice as a response
        return response()->json($invoice, 201);
    }

    // Sum the month_total for the most recent monthly invoice
    public function sumAmount(Request $request)
    {
        // Validate the incoming request for month_total
        $request->validate([
            'month_total' => 'required|numeric',
        ]);

        // Get the most recent monthly invoice (latest record based on created_at)
        $latestInvoice = MonthlyInvoice::latest('created_at')->first();

        // If there is no invoice, return an error message
        if (!$latestInvoice) {
            return response()->json(['message' => 'No invoices found'], 404);
        }

        // Sum the month_total input with the latest invoice's month_total
        $newMonthTotal = $latestInvoice->month_total + $request->month_total;

        // Update the latest invoice with the new summed amount
        $latestInvoice->update([
            'month_total' => $newMonthTotal
        ]);

        // Return the updated invoice data along with a success message
        return response()->json([
            'message' => 'Month total updated successfully',
            'new_month_total' => $newMonthTotal,
            'invoice' => $latestInvoice // Optionally include the updated invoice
        ]);
    }

    // Get all monthly invoices
    public function index()
    {
        // Retrieve all monthly invoices
        $invoices = MonthlyInvoice::all();

        // Return the list of invoices
        return response()->json($invoices);
    }

    // Show a specific monthly invoice by ID
    public function show($id)
    {
        // Find the monthly invoice by its ID
        $invoice = MonthlyInvoice::find($id);

        // If invoice not found, return an error message
        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        // Return the invoice
        return response()->json($invoice);
    }

    // Update a specific monthly invoice by ID
    public function update(Request $request, $id)
    {
        // Validate the incoming data
        $request->validate([
            'month_total' => 'required|numeric',
            'month_target' => 'required|numeric',
        ]);

        // Find the monthly invoice by its ID
        $invoice = MonthlyInvoice::find($id);

        // If invoice not found, return an error message
        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        // Update the invoice with the new data
        $invoice->update([
            'month_total' => $request->month_total,
            'month_target' => $request->month_target,
        ]);

        // Return the updated invoice
        return response()->json($invoice);
    }

    // Delete a specific monthly invoice by ID
    public function destroy($id)
    {
        // Find the monthly invoice by its ID
        $invoice = MonthlyInvoice::find($id);

        // If invoice not found, return an error message
        if (!$invoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        // Delete the invoice
        $invoice->delete();

        // Return a success message
        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}
