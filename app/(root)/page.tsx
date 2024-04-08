import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions"
import { currentUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils"
import { Dancing_Script } from "next/font/google"

const font = Dancing_Script({ 
    subsets: ["latin"],
    weight : ['400', '500', '600', '700']
})


const Home = async () => {
  const result = await fetchPosts(1, 30)
  const user = await currentUser();

  if (!user) return null;

  return (
    <>
      <h1 className={cn('head-text text-left', font.className)}>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        {
          result.posts.length === 0 ? (
            <p className='no-result'>No threads found</p>
          ) : (
            <>
              {
                result.posts.map((post) => (
                  <ThreadCard
                    key={post._id}
                    id={post._id}
                    currentUserId={user.id}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                  />
                ))
              }
            </>
          )
        }
      </section>
    </>
  )
}

export default Home