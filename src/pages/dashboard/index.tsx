import { useEffect, useState } from "react";
import PostCard from "../../components/posts/PostCard";
import type { Post } from "../../types/post.types";
import { getPostsFromUser } from "../../services/posts.service";

export default function DashBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPostsFromUser();
      console.log(data)
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <section>
      <div className="mx-auto mb-6 max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900">Posts</h2>
        <p className="mt-1 text-sm text-slate-500">
          Latest posts shared by users
        </p>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
