import { cn } from "@/lib/utils"
import { Dancing_Script } from "next/font/google"

const font = Dancing_Script({ 
    subsets: ["latin"],
    weight : ['400', '500', '600', '700']
})

const CommunitiesPage = async () => {
    return (
        <section>
            <h1 className={cn('head-text mb-10', font.className)}>Search</h1>
        </section>
    )
}

export default CommunitiesPage