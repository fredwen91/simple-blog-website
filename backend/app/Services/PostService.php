<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class PostService
{
    public function myPosts($request): LengthAwarePaginator
    {
        $perPage = $request->integer('itemsPerPage', 10);

        return Post::query()
            ->where('user_id', Auth::id())
            ->select([
                'id',
                'title',
                'content',
                'created_at',
                'updated_at',
            ])
            ->search($request->search)
            ->sort($request->sortKey, $request->sortOrder)
            ->paginate($perPage)
            ->withQueryString();
    }
}
