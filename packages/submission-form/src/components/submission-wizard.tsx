"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CircuitBackground,
} from "@ictirc/ui";
import Link from "next/link";
import {
  paperDetailsSchema,
  authorsStepSchema,
  uploadSchema,
  type AuthorFormData,
} from "../validation/schemas";
import type { Category, SubmissionUser } from "../types";

/**
 * Props for the SubmissionWizard component
 */
export interface SubmissionWizardProps {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Current user profile data (if authenticated) */
  currentUser?: SubmissionUser;
  /** Categories for the dropdown */
  categories: Category[];
  /** Loading state for categories */
  categoriesLoading?: boolean;
  /** Callback when submission is successful */
  onSuccess?: (paperId: string) => void;
  /** Callback for guest submission success (triggers "create account" modal) */
  onGuestSubmitSuccess?: () => void;
  /** Function to show toast notifications */
  showToast: (message: string, type: "success" | "error") => void;
  /** Function to handle form submission */
  onSubmit: (formData: FormData) => Promise<{ success: boolean; paperId?: string; error?: string }>;
  /** Optional link to guidelines */
  guidelinesUrl?: string;
}

/**
 * Shared SubmissionWizard Component
 * 
 * Used by both apps/web (guest & authenticated) and apps/author (authenticated only)
 * Provides a multi-step form for submitting research papers.
 */
export function SubmissionWizard({
  isAuthenticated,
  currentUser,
  categories,
  categoriesLoading = false,
  onSuccess,
  onGuestSubmitSuccess,
  showToast,
  onSubmit,
  guidelinesUrl = "/guides",
}: SubmissionWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedParentId, setSelectedParentId] = useState("");

  // Initialize form with current user data if authenticated
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    categoryId: "",
    authors: [
      currentUser
        ? {
            name: currentUser.name,
            email: currentUser.email,
            affiliation: currentUser.affiliation || "",
          }
        : { name: "", email: "", affiliation: "" },
    ] as AuthorFormData[],
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update first author if user logs in
  useEffect(() => {
    if (currentUser && formData.authors[0]) {
      setFormData((prev) => ({
        ...prev,
        authors: [
          {
            name: currentUser.name,
            email: currentUser.email,
            affiliation: currentUser.affiliation || prev.authors[0]?.affiliation || "",
          },
          ...prev.authors.slice(1),
        ],
      }));
    }
  }, [currentUser]);

  // Author management
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

  // Validation
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

  const handleStepChange = (newStep: number) => {
    if (newStep < step) {
      setStep(newStep);
      return;
    }
    if (validateCurrentStep()) {
      setStep(newStep);
    }
  };

  // File handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
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
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
      }
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Final validation
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

      // Build FormData
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title);
      submitFormData.append("abstract", formData.abstract);
      submitFormData.append("keywords", formData.keywords);
      submitFormData.append("categoryId", formData.categoryId);
      submitFormData.append("authors", JSON.stringify(formData.authors));
      submitFormData.append("file", uploadedFile);
      
      if (currentUser?.id) {
        submitFormData.append("userId", currentUser.id);
      }

      // Call the provided submit function
      const result = await onSubmit(submitFormData);

      if (!result.success) {
        showToast(result.error || "Submission failed. Please try again.", "error");
        setIsSubmitting(false);
        return;
      }

      // Success
      showToast("Paper submitted successfully!", "success");

      if (isAuthenticated && onSuccess && result.paperId) {
        onSuccess(result.paperId);
      } else if (!isAuthenticated && onGuestSubmitSuccess) {
        onGuestSubmitSuccess();
      }

      // Reset form
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

  // Filter categories
  const parentCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => c.parentId === selectedParentId);

  return (
    <div className="pt-14 md:pt-16 min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE - Instructions */}
      <div className="lg:w-2/5 bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 relative overflow-hidden flex items-center justify-center p-6 lg:p-12">
        <CircuitBackground variant="subtle" animated className="opacity-30" />

        <div className="relative z-10 max-w-md text-white">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-5xl font-bold mb-3">
              Submit Your <span className="text-gold">Research</span>
            </h1>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm lg:text-base">
              Share your ICT research with the ISUFST academic community.
            </p>

            {/* Auth status banner */}
            {isAuthenticated && currentUser && (
              <div className="bg-gold/20 border border-gold/30 rounded-lg p-3 mb-4">
                <p className="text-sm text-gold">
                  ✓ Signed in as <strong>{currentUser.name}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gold mb-3">Submission Guidelines</h2>
            <p className="text-gray-300 leading-relaxed mb-4 text-sm">
              Ensure your manuscript is submission-ready by applying the standard format
              provided in the download link.
            </p>

            <Link href={guidelinesUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                View Guidelines
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="lg:w-3/5 bg-gray-50 p-4 lg:p-6">
        <div className="w-full max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
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
                    {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
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
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border-b-2 ${
                      errors.abstract ? "border-red-500" : "border-gray-300"
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

                {/* Category Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Research Topic (Category)
                    </label>
                    <select
                      id="topic-select"
                      className="w-full bg-gray-50 border-b-2 border-gray-300 rounded-t-md px-4 py-3 font-mono text-sm focus:outline-none focus:border-maroon focus:bg-white transition-colors duration-200"
                      value={selectedParentId}
                      onChange={(e) => {
                        setSelectedParentId(e.target.value);
                        setFormData({ ...formData, categoryId: "" });
                      }}
                      disabled={categoriesLoading}
                    >
                      <option value="">{categoriesLoading ? "Loading..." : "Select a research topic"}</option>
                      {parentCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subtopic-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Sub-Topic
                    </label>
                    <select
                      id="subtopic-select"
                      className={`w-full bg-gray-50 border-b-2 rounded-t-md px-4 py-3 font-mono text-sm focus:outline-none transition-colors duration-200 ${
                        errors.categoryId
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-maroon focus:bg-white"
                      } ${!selectedParentId ? "opacity-50 cursor-not-allowed" : ""}`}
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      disabled={!selectedParentId || categoriesLoading}
                    >
                      <option value="">Select a sub-topic</option>
                      {childCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage message={errors.categoryId} />
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => handleStepChange(2)} className="w-full sm:w-auto">
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
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4 relative">
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
                      Author {index + 1} {index === 0 && "(Corresponding Author)"}
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
                        disabled={index === 0 && isAuthenticated}
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
                        disabled={index === 0 && isAuthenticated}
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
                      className={`border-2 border-dashed ${
                        errors.file ? "border-red-500" : "border-gray-300"
                      } rounded-xl p-8 text-center hover:border-maroon transition-colors cursor-pointer`}
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
                          {i === 0 && (
                            <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">
                              Corresponding
                            </span>
                          )}
                          {author.email && (
                            <span className="text-gray-500 font-normal"> ({author.email})</span>
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
                  <Button variant="ghost" onClick={() => setStep(3)} disabled={isSubmitting}>
                    Back
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Paper"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
