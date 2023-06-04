import { getDocs, limit, orderBy, query } from "firebase/firestore";
import { postCollectionRef } from "./PostService"
import { Post, RecentHashtags } from "../utils/types";

export async function getAllRecentHashtags() : Promise<RecentHashtags[]> {


    const q = query(postCollectionRef, orderBy("hashtags"), limit(100));
    const tags = new Map()

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const post = doc.data() as Post

        post.hashtags.forEach( tag => {
            if( tags.has(tag))  {
                // const currentCount = tags.get(tag) + 1
                tags.set(tag, tags.get(tag) + 1 )

            } else {
                tags.set(tag, 1)
            }
        })
    });

    const tagsArr : RecentHashtags[] = [...tags].map( key => ({ tag : key[0], count : key[1] }) )

    return tagsArr
}