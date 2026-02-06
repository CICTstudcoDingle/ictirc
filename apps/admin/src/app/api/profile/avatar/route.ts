import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@ictirc/database";
import { uploadProfileImage, deleteProfileImage } from "@ictirc/storage";

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

    // Upload to Supabase Storage profile bucket
    const result = await uploadProfileImage(user.id, file, {
      contentType: file.type,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Upload failed" },
        { status: 500 }
      );
    }

    // Update database with new avatar URL
    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: result.url },
    });

    return NextResponse.json({
      success: true,
      avatarUrl: result.url,
    });
  } catch (error) {
    console.error("[Admin Avatar API] Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Avatar API] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    );
  }
}
