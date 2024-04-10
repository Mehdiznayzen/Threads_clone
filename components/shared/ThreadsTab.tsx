import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";


interface ThreadsTabProps {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ({ accountId, accountType, currentUserId } : ThreadsTabProps) => {
    let result : any;

    if(accountType === 'Community'){
        result = await fetchCommunityPosts(accountId)
    }else {
        result = await fetchUserPosts(accountId)
    }

    if(!result) redirect('/')

    return (
        <section className="mt-9 flex gap-10 flex-col">
            {
                result.threads.map((thread: any) => (
                    <ThreadCard
                        key={thread._id}
                        id={thread._id}
                        currentUserId={currentUserId}
                        parentId={thread.parentId}
                        content={thread.text}
                        author={
                            accountType === "User" ? 
                                { 
                                    name: result.name, 
                                    image: result.image, 
                                    id: result.id 
                                } 
                                :
                                {
                                    name: thread.author.name,
                                    image: thread.author.image,
                                    id: thread.author.id,
                                }
                        }
                        community={thread.community}
                        createdAt={thread.createdAt}
                        comments={thread.children}
                    />
                ))
            }
        </section>
    )
}

export default ThreadsTab