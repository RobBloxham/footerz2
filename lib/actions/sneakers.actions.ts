"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Sneakers from "../models/sneakers.model";
import Community from "../models/community.model";

export async function fetchSneakers(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Sneakers.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })


  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Sneakers.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
    nickname: string,
    colorway: string,
    releaseDate: string,
    author: string,
    path: string,
  }

  export async function createSneakers({ nickname, colorway, releaseDate, author, path }: Params
  ) {
    try {
      connectToDB();

      const createSneakers = await Sneakers.create({
        nickname,
        colorway,
        releaseDate,
        author

      });
  
      // Update User model
      await User.findByIdAndUpdate(author, {
        $push: { sneakers: createSneakers._id },
      });

      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to create sneakers: ${error.message}`);
    }
  }

  async function fetchAllChildSneakers(threadId: string): Promise<any[]> {
    const childSneakers = await Sneakers.find({ parentId: threadId });
  
    const descendantSneakers = [];
    for (const childSneakers of childSneakers) {
      const descendants = await fetchAllChildSneakers(childSneakers._id);
      descendantSneakers.push(childSneakers, ...descendants);
    }
  
    return descendantSneakers;
  }

  export async function deleteSneakers(id: string, path: string): Promise<void> {
    try {
      connectToDB();
  
      // Find the thread to be deleted (the main thread)
      const mainSneakers = await Sneakers.findById(id).populate("author community");
  
      if (!mainSneakers) {
        throw new Error("Sneakers not found");
      }
  
      // Fetch all child threads and their descendants recursively
      const descendantSneakers = await fetchAllChildSneakers(id);
  
      // Get all descendant thread IDs including the main thread ID and child thread IDs
      const descendantSneakersIds = [
        id,
        ...descendantSneakers.map((sneakers) => sneakers._id),
      ];
  
      // Extract the authorIds and communityIds to update User and Community models respectively
      const uniqueAuthorIds = new Set(
        [
          ...descendantSneakers.map((sneakers) => sneakers.author?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainSneakers.author?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
      const uniqueCommunityIds = new Set(
        [
          ...descendantSneakers.map((sneakers) => sneakers.community?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainSneakers.community?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
      // Recursively delete child threads and their descendants
      await Sneakers.deleteMany({ _id: { $in: descendantSneakersIds } });
  
      // Update User model
      await User.updateMany(
        { _id: { $in: Array.from(uniqueAuthorIds) } },
        { $pull: { sneakers: { $in: descendantSneakersIds } } }
      );
  
      // Update Community model
      await Community.updateMany(
        { _id: { $in: Array.from(uniqueCommunityIds) } },
        { $pull: { threads: { $in: descendantSneakersIds } } }
      );
  
      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to delete thread: ${error.message}`);
    }
  }
  
  export async function fetchSneakersById(deleteSneakersId: string) {
    connectToDB();
  
    try {
      const sneakers = await Sneakers.findById(sneakersId)
        .populate({
          path: "author",
          model: User,
          select: "_id id name image",
        }) // Populate the author field with _id and username
        .populate({
          path: "community",
          model: Community,
          select: "_id id name image",
        }) // Populate the community field with _id and name
        .populate({
          path: "children", // Populate the children field
          populate: [
            {
              path: "author", // Populate the author field within children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
            {
              path: "children", // Populate the children field within children
              model: Sneakers, // The model of the nested children (assuming it's the same "Thread" model)
              populate: {
                path: "author", // Populate the author field within nested children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec();
  
      return sneakers;
    } catch (err) {
      console.error("Error while fetching Sneakers:", err);
      throw new Error("Unable to fetch Sneakers");
    }
  }