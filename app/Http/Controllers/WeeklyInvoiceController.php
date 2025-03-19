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

    // Show all the weekly invoices
    public function index()
    {
        $weeklyInvoices = WeeklyInvoice::all();
        return response()->json($weeklyInvoices);
    }

        public function getLatestWeekTotal()
    {
        $latestInvoice = WeeklyInvoice::latest('created_at')->first();

        if (!$latestInvoice) {
            return response()->json(['message' => 'No weekly invoices found'], 404);
        }

        return response()->json([
            'latest_week_total' => $latestInvoice->week_total,
        ]);
    }
    
        public function getLatestWeekTarget()
    {
        $latestInvoice = WeeklyInvoice::latest('created_at')->first();

        if (!$latestInvoice) {
            return response()->json(['message' => 'No weekly invoices found'], 404);
        }

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

    // Add week invoice
     public function sumWeekTotal(Request $request)
     {
         $request->validate([
             'week_total' => 'required|numeric',
         ]);

         $latestInvoice = WeeklyInvoice::latest('created_at')->first();

         if (!$latestInvoice) {
             return response()->json(['message' => 'No weekly invoices found'], 404);
         }

         $newWeekTotal = $latestInvoice->week_total + $request->week_total;
 
         $latestInvoice->update([
             'week_total' => $newWeekTotal
         ]);
     
         return response()->json([
             'message' => 'Week total updated successfully',
             'new_week_total' => $newWeekTotal,
             'invoice' => $latestInvoice
         ]);
     }
    //  Store Weekly Invoice
    public function store(Request $request)
    {
        $request->validate([
            'week_total' => 'required|numeric',
            'week_target' => 'required|numeric',
        ]);
        $invoice = WeeklyInvoice::create([
            'week_total' => $request->week_total,
            'week_target' => $request->week_target,
        ]);
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
