"use client";

import React, { useState, useEffect } from "react";
import { Upload, FileText, X, ChevronRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CircuitBackground } from "@ictirc/ui";
import {
  paperDetailsSchema,
  authorsStepSchema,
  uploadSchema,
  type AuthorFormData,
} from "@/lib/validation";
import { useToast } from "@/lib/use-toast";
import { submitPaper, getCategories } from "./actions/submit-paper";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function SubmitPage() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    categoryId: "",
    authors: [{ name: "", email: "", affiliation: "" }] as AuthorFormData[],
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  // Fetch categories from database on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getCategories();
        if (result.success && result.categories) {
          setCategories(result.categories);
        } else {
          console.error("Failed to load categories:", result.error);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  const addAuthor = () => {
    setFormData({
      ...formData,
      authors: [...formData.authors, { name: "", email: "", affiliation: "" }],
    });
  };

  const removeAuthor = (index: number) => {
    if (formData.authors.length > 1) {
      setFormData({
        ...formData,
        authors: formData.authors.filter((_, i) => i !== index),
      });
    }
  };

  // Validation helper functions
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      const result = paperDetailsSchema.safeParse(formData);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          newErrors[err.path[0] as string] = err.message;
        });
      }
    } else if (step === 2) {
      const result = authorsStepSchema.safeParse({ authors: formData.authors });
      if (!result.success) {
        result.error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
      }
    } else if (step === 3) {
      const result = uploadSchema.safeParse({ file: uploadedFile });
      if (!result.success) {
        result.error.errors.forEach((err) => {
          newErrors["file"] = err.message;
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canProceed = (): boolean => {
    return validateCurrentStep();
  };

  const handleStepChange = (newStep: number) => {
    // Allow going back without validation
    if (newStep < step) {
      setStep(newStep);
      return;
    }

    // Validate before proceeding forward
    if (validateCurrentStep()) {
      setStep(newStep);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Clear file errors when a file is selected
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.file;
        return newErrors;
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Final validation of all steps
      const paperValid = paperDetailsSchema.safeParse(formData);
      const authorsValid = authorsStepSchema.safeParse({ authors: formData.authors });
      const fileValid = uploadSchema.safeParse({ file: uploadedFile });

      if (!paperValid.success || !authorsValid.success || !fileValid.success) {
        showToast("Please complete all required fields before submitting", "error");
        setIsSubmitting(false);
        return;
      }

      if (!uploadedFile) {
        showToast("Please upload your manuscript file", "error");
        setIsSubmitting(false);
        return;
      }

      // Build FormData for server action
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title);
      submitFormData.append("abstract", formData.abstract);
      submitFormData.append("keywords", formData.keywords);
      submitFormData.append("categoryId", formData.categoryId);
      submitFormData.append("authors", JSON.stringify(formData.authors));
      submitFormData.append("file", uploadedFile);

      // Call the server action
      const result = await submitPaper(submitFormData);

      if (!result.success) {
        showToast(result.error || "Submission failed. Please try again.", "error");
        setIsSubmitting(false);
        return;
      }

      // Success
      showToast("Paper submitted successfully! You will receive a confirmation email shortly.", "success");

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: "",
          abstract: "",
          keywords: "",
          categoryId: "",
          authors: [{ name: "", email: "", affiliation: "" }],
        });
        setUploadedFile(null);
        setStep(1);
      }, 1500);

    } catch (error) {
      console.error("Submission error:", error);
      showToast("Failed to submit paper. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // File input ref for programmatic triggering
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        setUploadedFile(file);
        // Clear file errors when a file is dropped
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    }
  };

  // Error message component
  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Header - Dark with Circuit Texture */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 py-10 md:py-16 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
            Submit Your <span className="text-gold">Research</span>
          </h1>
          <p className="text-gray-300">
            Share your ICT research with the ISUFST academic community.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {["Paper Details", "Authors", "Upload", "Review"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <button
                onClick={() => handleStepChange(i + 1)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  step === i + 1
                    ? "bg-maroon text-white"
                    : step > i + 1
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
                  {step > i + 1 ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < 3 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* Step 1: Paper Details */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Paper Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Input
                  label="Paper Title"
                  placeholder="Enter the full title of your research paper"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? "border-red-500" : ""}
                />
                <ErrorMessage message={errors.title} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract
                </label>
                <textarea
                  rows={6}
                  placeholder="Provide a summary of your research (250-500 words)"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border-b-2 ${errors.abstract ? "border-red-500" : "border-gray-300"
                    } focus:border-maroon focus:outline-none resize-none`}
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                />
                <ErrorMessage message={errors.abstract} />
              </div>

              <div>
                <Input
                  label="Keywords (comma-separated)"
                  placeholder="e.g., machine learning, security, IoT"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className={errors.keywords ? "border-red-500" : ""}
                />
                <ErrorMessage message={errors.keywords} />
              </div>

              <div>
                <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category-select"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border-b-2 ${errors.categoryId ? "border-red-500" : "border-gray-300"
                    } focus:border-maroon focus:outline-none`}
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  disabled={categoriesLoading}
                >
                  <option value="">{categoriesLoading ? "Loading categories..." : "Select a category"}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ErrorMessage message={errors.categoryId} />
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => handleStepChange(2)}
                  className="w-full sm:w-auto"
                >
                  Continue to Authors
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Authors */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Authors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.authors.map((author, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg space-y-4 relative"
                >
                  {formData.authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                      aria-label={`Remove author ${index + 1}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <p className="text-sm font-medium text-gray-500">
                    Author {index + 1} {index === 0 && "(Primary)"}
                  </p>
                  <div>
                    <Input
                      label="Full Name"
                      placeholder="e.g., Juan Dela Cruz"
                      value={author.name}
                      onChange={(e) => {
                        const newAuthors = [...formData.authors];
                        newAuthors[index]!.name = e.target.value;
                        setFormData({ ...formData, authors: newAuthors });
                      }}
                      className={errors[`authors.${index}.name`] ? "border-red-500" : ""}
                    />
                    <ErrorMessage message={errors[`authors.${index}.name`]} />
                  </div>
                  <div>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="e.g., jdelacruz@isufst.edu.ph"
                      value={author.email}
                      onChange={(e) => {
                        const newAuthors = [...formData.authors];
                        newAuthors[index]!.email = e.target.value;
                        setFormData({ ...formData, authors: newAuthors });
                      }}
                      className={errors[`authors.${index}.email`] ? "border-red-500" : ""}
                    />
                    <ErrorMessage message={errors[`authors.${index}.email`]} />
                  </div>
                  <div>
                    <Input
                      label="Affiliation"
                      placeholder="e.g., ISUFST - College of ICT"
                      value={author.affiliation}
                      onChange={(e) => {
                        const newAuthors = [...formData.authors];
                        newAuthors[index]!.affiliation = e.target.value;
                        setFormData({ ...formData, authors: newAuthors });
                      }}
                      className={errors[`authors.${index}.affiliation`] ? "border-red-500" : ""}
                    />
                    <ErrorMessage message={errors[`authors.${index}.affiliation`]} />
                  </div>
                </div>
              ))}

              <Button variant="secondary" onClick={addAuthor} className="w-full">
                + Add Another Author
              </Button>

              <div className="flex gap-4 pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => handleStepChange(3)} className="flex-1 sm:flex-none">
                  Continue to Upload
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Upload */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Manuscript</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!uploadedFile ? (
                <div>
                  <div
                    className={`border-2 border-dashed ${errors.file ? "border-red-500" : "border-gray-300"} rounded-xl p-8 text-center hover:border-maroon transition-colors cursor-pointer`}
                    onClick={handleFileClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your manuscript here, or click to browse
                    </p>
                    <p className="text-sm text-gray-400">
                      Accepted formats: PDF, DOCX (Max 50MB)
                    </p>
                    <Button
                      variant="secondary"
                      className="mt-4"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileClick();
                      }}
                    >
                      Select File
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    aria-label="Upload manuscript file"
                    id="file-upload"
                    onChange={handleFileUpload}
                  />
                  <ErrorMessage message={errors.file} />
                </div>
              ) : (
                <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                        type="button"
                      onClick={removeFile}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove uploaded file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Submission Guidelines</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Paper must be original and not published elsewhere</li>
                  <li>• Follow the ICTIRC formatting template</li>
                  <li>• Remove all author identifying information for blind review</li>
                  <li>• Include all figures and tables in the manuscript</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => handleStepChange(4)} className="flex-1 sm:flex-none">
                  Review Submission
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Title</p>
                  <p className="font-medium text-gray-900">
                    {formData.title || "Not provided"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-gray-900">
                    {categories.find((c) => c.id === formData.categoryId)?.name || "Not selected"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Authors</p>
                  <div className="space-y-2">
                    {formData.authors.map((author, i) => (
                      <p key={i} className="font-medium text-gray-900">
                        {author.name || `Author ${i + 1}`}
                        {author.email && (
                          <span className="text-gray-500 font-normal">
                            {" "}
                            ({author.email})
                          </span>
                        )}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Manuscript</p>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-maroon" />
                    <p className="font-medium text-gray-900">
                      {uploadedFile ? uploadedFile.name : "No file uploaded"}
                    </p>
                  </div>
                  {uploadedFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gold/10 rounded-lg border border-gold/30">
                <p className="text-sm text-amber-800">
                  By submitting, you confirm that this is original work and agree
                  to the ICTIRC publication terms and CC BY-ND license.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 sm:flex-none"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Paper"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
