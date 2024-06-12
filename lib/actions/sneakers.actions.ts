"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Sneakers from "../models/sneakers.model";

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