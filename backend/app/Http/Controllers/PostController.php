<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return PostResource::collection(
            Post::with('user', 'comments.user')->latest()->paginate(10)
        );
    }

    public function store(StorePostRequest $request)
    {
        $post = $request->user()->posts()->create($request->validated());
        return new PostResource($post);
    }

    public function show(Post $post)
    {
        return new PostResource($post->load('comments.user'));
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $post->update($request->validated());
        return new PostResource($post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();
        return response()->noContent();
    }

    public function myPosts()
    {
        return PostResource::collection(Auth::user()->posts);
    }
}
