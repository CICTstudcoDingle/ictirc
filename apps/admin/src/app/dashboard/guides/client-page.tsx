"use client";

import { useState } from "react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, FileUpload } from "@ictirc/ui";
import { Plus, Trash2, FileText, FolderOpen, Save, Book } from "lucide-react";
import { createCategory, deleteCategory, createGuide, deleteGuide } from "./actions";
import { useToast } from "@/lib/toast";
import { uploadFile } from "@ictirc/storage";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count?: { guides: number };
}

interface Guide {
  id: string;
  title: string;
  fileUrl: string;
  order: number;
  guideCategory?: Category | null;
}

interface GuidesClientPageProps {
  initialCategories: Category[];
  initialGuides: Guide[];
}

export function GuidesClientPage({ initialCategories, initialGuides }: GuidesClientPageProps) {
  const [activeTab, setActiveTab] = useState<"guides" | "categories">("guides");
  const [categories, setCategories] = useState(initialCategories);
  const [guides, setGuides] = useState(initialGuides);
  const { addToast } = useToast();

  const showToast = (message: string, type: "success" | "error") => {
    addToast(type, type === "success" ? "Success" : "Error", message);
  };

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Guide Form State
  const [newGuideTitle, setNewGuideTitle] = useState("");
  const [newGuideFile, setNewGuideFile] = useState<File | null>(null);
  const [newGuideCategoryId, setNewGuideCategoryId] = useState("");
  const [isCreatingGuide, setIsCreatingGuide] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    setIsCreatingCategory(true);
    const result = await createCategory({ name: newCategoryName, description: newCategoryDesc });
    setIsCreatingCategory(false);

    if (result.success && result.category) {
      setCategories([...categories, result.category]);
      setNewCategoryName("");
      setNewCategoryDesc("");
      showToast("Category created successfully", "success");
    } else {
      showToast(result.error || "Failed to create category", "error");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will delete the category.")) return;
    const result = await deleteCategory(id);
    if (result.success) {
      setCategories(categories.filter((c) => c.id !== id));
      showToast("Category deleted", "success");
    } else {
      showToast(result.error || "Failed to delete category", "error");
    }
  };

  const handleCreateGuide = async () => {
    if (!newGuideTitle || !newGuideFile || !newGuideCategoryId) {
      showToast("Please fill all fields and select a file", "error");
      return;
    }
    setIsCreatingGuide(true);

    try {
      // Upload file to research guides bucket
      const timestamp = Date.now();
      const sanitizedName = newGuideFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `guides/${timestamp}-${sanitizedName}`;

      const uploadResult = await uploadFile(newGuideFile, filePath, "research guides");

      if (!uploadResult.success || !uploadResult.url) {
        showToast(uploadResult.error || "Failed to upload file", "error");
        setIsCreatingGuide(false);
        return;
      }

      const result = await createGuide({
        title: newGuideTitle,
        fileUrl: uploadResult.url,
        categoryId: newGuideCategoryId,
      });

      if (result.success && result.guide) {
        setGuides([...guides, result.guide as Guide]);
        setNewGuideTitle("");
        setNewGuideFile(null);
        showToast("Guide created successfully", "success");
      } else {
        showToast(result.error || "Failed to create guide", "error");
      }
    } catch (error) {
      showToast("Failed to create guide", "error");
    } finally {
      setIsCreatingGuide(false);
    }
  };

  const handleDeleteGuide = async (id: string) => {
    if (!confirm("Delete this guide?")) return;
    const result = await deleteGuide(id);
    if (result.success) {
      setGuides(guides.filter((g) => g.id !== id));
      showToast("Guide deleted", "success");
    } else {
      showToast("Failed to delete guide", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("guides")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "guides"
              ? "bg-white text-maroon shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Research Guides
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "categories"
              ? "bg-white text-maroon shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Categories
        </button>
      </div>

      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Add Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Name</label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Thesis Templates"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                <Input
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <Button
                onClick={handleCreateCategory}
                disabled={isCreatingCategory || !newCategoryName}
                className="w-full"
              >
                {isCreatingCategory ? "Creating..." : "Create Category"}
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Existing Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No categories found.</p>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-maroon/10 rounded-lg flex items-center justify-center text-maroon">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{cat.name}</p>
                          {cat.description && (
                            <p className="text-xs text-gray-500">{cat.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">
                          {cat._count?.guides || 0} guides
                        </span>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "guides" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Add New Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Title</label>
                <Input
                  value={newGuideTitle}
                  onChange={(e) => setNewGuideTitle(e.target.value)}
                  placeholder="e.g., APA Citation Style"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">File</label>
                <FileUpload
                  accept=".pdf,.doc,.docx"
                  onFileSelect={(file) => setNewGuideFile(file)}
                  onRemove={() => setNewGuideFile(null)}
                  variant="file"
                  description="Upload a research guide (PDF or Word)"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
                <select
                  value={newGuideCategoryId}
                  onChange={(e) => setNewGuideCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleCreateGuide}
                disabled={isCreatingGuide || !newGuideTitle || !newGuideCategoryId || !newGuideFile}
                className="w-full"
              >
                {isCreatingGuide ? "Adding..." : "Add Guide"}
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Research Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {guides.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No guides uploaded yet.</p>
                ) : (
                  guides.map((guide) => (
                    <div
                      key={guide.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-maroon/30 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{guide.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-maroon font-medium bg-maroon/5 px-2 py-0.5 rounded">
                              {guide.guideCategory?.name || "Uncategorized"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <a 
                            href={guide.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                        >
                            View
                         </a>
                        <button
                          onClick={() => handleDeleteGuide(guide.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
