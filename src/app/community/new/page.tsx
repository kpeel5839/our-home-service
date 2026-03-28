import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/layout/TopHeader";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { Post } from "@/lib/types";

export default function CommunityNewPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      setSaving(true);
      await api.post<Post>("/posts", {
        authorId: "m1",
        content: content.trim(),
        images: [],
      });
      navigate("/community", { replace: true });
    } catch (e) {
      alert(e instanceof Error ? e.message : "등록에 실패했어요");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TopHeader title="피드 작성" showBack />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto flex flex-col gap-4">
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">피드 작성</h1>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-base mb-1.5">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 있었던 일을 가족과 공유해보세요 😊"
            rows={8}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || saving}
          className="w-full"
        >
          {saving ? "등록 중..." : "등록하기"}
        </Button>
      </div>
    </>
  );
}
