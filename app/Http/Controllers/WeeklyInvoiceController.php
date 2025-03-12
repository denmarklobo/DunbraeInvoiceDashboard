<?php

namespace App\Http\Controllers;

use App\Models\WeeklyInvoice;
use Illuminate\Http\Request;

class WeeklyInvoiceController extends Controller
{
    /**
     * Display a listing of the weekly invoices.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $weeklyInvoices = WeeklyInvoice::all();
        return response()->json($weeklyInvoices);
    }

        public function getLatestWeekTotal()
    {
        // Get the most recent weekly invoice (latest record based on created_at)
        $latestInvoice = WeeklyInvoice::latest('created_at')->first();

        // If no invoice is found, return an error message
        if (!$latestInvoice) {
            return response()->json(['message' => 'No weekly invoices found'], 404);
        }

        // Return the latest week_total
        return response()->json([
            'latest_week_total' => $latestInvoice->week_total,
        ]);
    }
    
        public function getLatestWeekTarget()
    {
        // Get the most recent weekly invoice (latest record based on created_at)
        $latestInvoice = WeeklyInvoice::latest('created_at')->first();

        // If no invoice is found, return an error message
        if (!$latestInvoice) {
            return response()->json(['message' => 'No weekly invoices found'], 404);
        }

        // Return the latest week_target
        return response()->json([
            'latest_week_target' => $latestInvoice->week_target,
        ]);
    }
    

    /**
     * Store a newly created weekly invoice in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */

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

public function store(Request $request)
{
    // Validate the incoming data
    $request->validate([
        'week_total' => 'required|numeric',
        'week_target' => 'required|numeric',
    ]);

    // Create a new weekly invoice with the given data
    $invoice = WeeklyInvoice::create([
        'week_total' => $request->week_total,
        'week_target' => $request->week_target,
    ]);

    // Return the created invoice as a response
    return response()->json($invoice, 201);
}

    public function show($id)
    {
        $weeklyInvoice = WeeklyInvoice::find($id);

        if (!$weeklyInvoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        return response()->json($weeklyInvoice);
    }

    /**
     * Update the specified weekly invoice in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'edit_id' => 'required|integer',
            'user_id' => 'required|integer',
            'week_total' => 'required|numeric',
            'week_target' => 'required|numeric',
        ]);

        $weeklyInvoice = WeeklyInvoice::find($id);

        if (!$weeklyInvoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        $weeklyInvoice->update($request->all());

        return response()->json($weeklyInvoice);
    }

    /**
     * Remove the specified weekly invoice from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $weeklyInvoice = WeeklyInvoice::find($id);

        if (!$weeklyInvoice) {
            return response()->json(['message' => 'Invoice not found'], 404);
        }

        $weeklyInvoice->delete();

        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}
