import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { deleteProfileImage } from "@ictirc/storage";

/**
 * Upload avatar image
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get form data with file
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large (max 50MB)" },
        { status: 400 }
      );
    }

    // Upload directly using the authenticated Supabase client
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PROFILE || "profile";
    
    // Generate path based on user ID
    let extension = "jpg";
    if (file.type.startsWith("image/")) {
      extension = file.type.split("/")[1] || "jpg";
    }
    const path = `${user.id}/avatar.${extension}`;

    console.log("[Avatar API] Uploading to:", { bucketName, path, contentType: file.type });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        contentType: file.type,
        upsert: true, // Allow overwriting
      });

    if (uploadError) {
      console.error("[Avatar API] Upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uploadData.path);

    const avatarUrl = urlData.publicUrl;

    // Update database with new avatar URL
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl },
    });

    // Also update Author record if exists
    if (user.email) {
      await prisma.author.updateMany({
        where: { email: user.email },
        data: { avatarUrl },
      });
    }

    return NextResponse.json({
      success: true,
      avatarUrl,
    });
  } catch (error) {
    console.error("[Avatar API] Upload error:", error);
    console.error("[Avatar API] Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error: JSON.stringify(error, null, 2)
    });
    return NextResponse.json(
      { 
        error: "Failed to upload avatar",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Delete avatar image
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete from storage
    const result = await deleteProfileImage(user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Delete failed" },
        { status: 500 }
      );
    }

    // Clear avatar URL in database
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: null },
    });

    // Also clear from Author record
    if (user.email) {
      await prisma.author.updateMany({
        where: { email: user.email },
        data: { avatarUrl: null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Avatar API] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    );
  }
}
