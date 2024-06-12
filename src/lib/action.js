"use server";

import { revalidatePath } from "next/cache";
import { Post } from "./models";
import { connectToDb } from "./utils";
import { signIn, signOut } from "./auth";

// Định nghĩa hàm addPost để thêm một bài viết mới vào cơ sở dữ liệu
export const addPost = async (formData) => {
  const { title, desc, slug, userId } = Object.fromEntries(formData);

  try {
    connectToDb();
    const newPost = new Post({
      title,
      desc,
      slug,
      userId,
    });

    await newPost.save();
    console.log("saved to db");
    revalidatePath("/blog");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

// Định nghĩa hàm deletePost để xóa một bài viết khỏi cơ sở dữ liệu
export const deletePost = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDb();

    await Post.findByIdAndDelete(id);
    console.log("deleted from db");
    revalidatePath("/blog");
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
};

// Hàm được gọi khi người dùng muốn đăng nhập vào ứng dụng bằng tài khoản GitHub của họ
export const handleGithubLogin = async () => {
  "use server";
  await signIn("github");
};

// Hàm được gọi khi người dùng muốn đăng xuất khỏi ứng dụng
export const handleLogout = async () => {
  "use server";
  await signOut();
};