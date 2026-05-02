import PostCard from "../../components/posts/PostCard";
import type { Post } from "../../types/post.types";

const posts: Post[] = [
  {
    id: "1",
    author: "deneme",
    title: "First Post",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(30),
  },
  {
    id: "2",
    author: "Admin User",
    title: "Dashboard Design",
    description:
      "We are building a LinkedIn-like feed card structure. ".repeat(25),
  },
];

export default function DashBoard() {
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