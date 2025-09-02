"use client";

import { Toaster, toast } from "sonner";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PostFormState } from "@/lib/types/formState";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserTags } from "@/lib/actions/postActions";

type Props = {
  state: PostFormState;
  formAction: (payload: FormData) => void;
};

const UpsertPostForm = ({ state, formAction }: Props) => {
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    state?.data?.tags?.split(",") || []
  );
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch tags khi component mount
  useEffect(() => {
    const loadUserTags = async () => {
      const tags = await getUserTags();
      if (tags.length > 0) {
        console.log("User tags fetched from server action:", tags);
        setAllTags(tags); // Lưu tất cả tags vào state
      } else {
        console.warn("No tags fetched for the user");
      }
    };
    loadUserTags();

    if (state?.message) {
      if (state.ok) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }

    if (state?.data?.tags) {
      const tags = state.data.tags.split(",");
      setSelectedTags(tags);
      console.log("Previous post tags from state:", tags);
    }
  }, [state]);

  // Cập nhật gợi ý khi người dùng nhập
  useEffect(() => {
    if (inputValue && allTags.length > 0) {
      const filteredSuggestions = allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, allTags, selectedTags]);

  // Xử lý khi nhấn Enter để thêm tag mới
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTags = inputValue
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag && !selectedTags.includes(tag));
      if (newTags.length > 0) {
        setSelectedTags([...selectedTags, ...newTags]);
        setInputValue("");
        setSuggestions([]); // Xóa gợi ý sau khi thêm
      }
    }
  };

  // Xử lý khi chọn gợi ý
  const handleSuggestionClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setInputValue("");
      setSuggestions([]);
    }
  };

  // Xóa tag khỏi danh sách
  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <Toaster />
      <form
        action={formAction}
        className="flex flex-col gap-5 [&>div>label]:text-slate-500 [&>div>input]:transition [&>div>textarea]:transition"
      >
        <input hidden name="postId" defaultValue={state?.data?.postId} />
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            placeholder="Enter The Title of Your Post"
            defaultValue={state?.data?.title}
          />
        </div>
        {!!state?.errors?.title && (
          <p className="text-red-500 animate-shake">{state.errors.title}</p>
        )}

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            name="content"
            placeholder="Write Your Post Content Here"
            rows={6}
            defaultValue={state?.data?.content}
          />
        </div>
        {!!state?.errors?.content && (
          <p className="text-red-500 animate-shake">{state.errors.content}</p>
        )}
        <div>
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files)
                setImageUrl(URL.createObjectURL(e.target.files[0]));
            }}
          />
          {!!state?.errors?.thumbnail && (
            <p className="text-red-500 animate-shake">{state.errors.thumbnail}</p>
          )}
          {(!!imageUrl || !!state?.data?.previousThumbnailUrl) && (
            <Image
              src={(imageUrl || state?.data?.previousThumbnailUrl) ?? ""}
              alt="post thumbnail"
              width={200}
              height={150}
            />
          )}
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            name="tags"
            placeholder="Enter tags and press Enter to add"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          {suggestions.length > 0 && (
            <ul className="mt-1 bg-white border rounded shadow-md max-h-40 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <input type="hidden" name="tags" value={selectedTags.join(",")} />
        </div>
        {!!state?.errors?.tags && (
          <p className="text-red-500 animate-shake">{state.errors.tags}</p>
        )}
        <div className="flex items-center">
          <input
            className="mx-2 w-4 h-4"
            type="checkbox"
            name="published"
            defaultChecked={state?.data?.published === "on" ? true : false}
          />
          <Label htmlFor="published">Published Now</Label>
        </div>
        {!!state?.errors?.isPublished && (
          <p className="text-red-500 animate-shake">{state.errors.isPublished}</p>
        )}

        <SubmitButton>Save</SubmitButton>
      </form>
    </>
  );
};

export default UpsertPostForm;