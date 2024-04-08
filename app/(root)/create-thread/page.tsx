import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation";

import { cn } from '@/lib/utils'
import { Dancing_Script } from 'next/font/google'

const font = Dancing_Script({ 
        subsets: ["latin"],
        weight : ['400', '500', '600', '700']
})

const CreateThread = async () => {
    const user = await currentUser()

    if(!user) return null;

    const userInfo = await fetchUser(user.id)

    if(!userInfo.onboarded) redirect('/onboarding')


    return (
        <>
            <h1 className={cn('head-text', font.className)}>Create Thread</h1>

            <PostThread
                userId={userInfo._id} 
            />
        </>
    )
}

export default CreateThread