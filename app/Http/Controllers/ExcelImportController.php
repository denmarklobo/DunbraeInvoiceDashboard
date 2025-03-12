<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use App\Models\Total;

class ExcelImportController extends Controller
{
    // Show the form to upload Excel
    public function showForm()
    {
        return view('import');
    }

    // Handle Excel file upload, calculate the sum, and store it in the database
    public function importExcelAndSum(Request $request)
    {
        try {
            // Validate the incoming file
            $request->validate([
                'excel_file' => 'required|file|mimes:xlsx,xls',
            ]);
    
            // Load the Excel file
            $file = $request->file('excel_file');
            $spreadsheet = IOFactory::load($file->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
    
            // Example: Summing data from column 'B'
            $columnToSum = 'B';
            $total = 0;
            
            // Iterate through the rows to calculate the sum
            foreach ($sheet->getRowIterator() as $rowIndex => $row) {
                if ($rowIndex == 1) {
                    continue; // Skip the header row
                }
    
                $cell = $sheet->getCell($columnToSum . $rowIndex);
                $value = $cell->getValue();
    
                // Sum only numeric values
                if (is_numeric($value)) {
                    $total += $value;
                }
            }
    
            // Store the total sum in the database
            Total::create(['total' => $total]);
    
            // Return the total to the view
            return view('import', ['total' => $total]);
            
        } catch (\Exception $e) {
            // Catch any error and return the error message to the view
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
    
}
