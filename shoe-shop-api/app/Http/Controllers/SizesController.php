<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SizeService;

class SizesController extends Controller
{
    protected $sizeService;

    public function __construct(SizeService $sizeService)
    {
        $this->sizeService = $sizeService;
    }

    // GET: /sizes
    public function index()
    {
        $sizes = $this->sizeService->getAllSizes();
        return response()->json($sizes);
    }

    // POST: /sizes
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $size = $this->sizeService->createSize($validated);
        return response()->json($size, 201);
    }

    // PUT: /sizes/{id}
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $size = $this->sizeService->updateSize($id, $validated);
        return response()->json($size);
    }

    // DELETE: /sizes/{id}
    public function destroy($id)
    {
        $this->sizeService->deleteSize($id);
        return response()->json(['message' => 'Size deleted successfully']);
    }
}
