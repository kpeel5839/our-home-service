import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils/date";
import type { Post, Comment, FamilyMember } from "@/lib/types";

export default function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [postData, membersData] = await Promise.all([
          api.get<Post>(`/posts/${id}`),
          api.get<FamilyMember[]>("/members"),
        ]);
        setPost(postData);
        setMembers(membersData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "오류가 발생했어요");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !post) {
    return (
      <>
        <TopHeader title="게시글" showBack />
        <EmptyState icon="😢" message="게시글을 찾을 수 없어요" />
      </>
    );
  }

  const author = members.find((m) => m.id === post.authorId);
  const isLiked = post.likes.includes("m1");

  const toggleLike = async () => {
    try {
      const result = await api.patch<{ likes: string[] }>(`/posts/${id}/like`, { memberId: "m1" });
      setPost((prev) => prev ? { ...prev, likes: result.likes } : prev);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했어요");
    }
  };

  const handleComment = async () => {
    if (!commentInput.trim()) return;
    try {
      const newComment = await api.post<Comment>(`/posts/${id}/comments`, {
        authorId: "m1",
        content: commentInput.trim(),
      });
      setPost((prev) => prev ? { ...prev, comments: [...prev.comments, newComment] } : prev);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했어요");
    }
    setCommentInput("");
  };

  return (
    <>
      <TopHeader title="게시글" showBack />
      <div className="max-w-2xl tablet:max-w-3xl mx-auto pb-32">
        {/* 이미지 갤러리 */}
        {post.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
            {post.images.map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-64 h-48 rounded-2xl overflow-hidden"
              >
                <img src={img} alt={`이미지 ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="px-4 pt-2">
          {/* 작성자 */}
          {author && (
            <div className="flex items-center gap-3 mb-4">
              <Avatar member={author} size="md" />
              <div>
                <p className="font-semibold text-text-base">{author.name}</p>
                <p className="text-xs text-text-muted">
                  {formatDate(post.createdAt.slice(0, 10))}
                </p>
              </div>
            </div>
          )}

          {/* 내용 */}
          <p className="text-sm text-text-base leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>

          {/* 좋아요 버튼 */}
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-colors min-h-[44px] ${
              isLiked
                ? "bg-red-50 border-red-200 text-red-500"
                : "border-gray-200 text-text-muted"
            }`}
          >
            <Heart size={16} className={isLiked ? "fill-current" : ""} />
            <span className="text-sm font-medium">{post.likes.length}</span>
          </button>

          {/* 구분선 */}
          <div className="border-t border-gray-100 my-4" />

          {/* 댓글 목록 */}
          <h2 className="font-semibold text-sm text-text-base mb-3">
            댓글 {post.comments.length}
          </h2>
          {post.comments.length === 0 ? (
            <EmptyState message="첫 댓글을 남겨보세요" className="py-6" />
          ) : (
            <div className="space-y-3 mb-4">
              {post.comments.map((comment) => {
                const commentAuthor = members.find((m) => m.id === comment.authorId);
                return (
                  <div key={comment.id} className="flex gap-2">
                    {commentAuthor && <Avatar member={commentAuthor} size="sm" />}
                    <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-medium text-text-base mb-0.5">
                        {commentAuthor?.name}
                      </p>
                      <p className="text-sm text-text-base">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 댓글 입력창 */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleComment();
              }
            }}
            placeholder="댓글을 입력해요..."
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button
            onClick={handleComment}
            disabled={!commentInput.trim()}
            size="md"
            className="flex-shrink-0"
          >
            등록
          </Button>
        </div>
      </div>
    </>
  );
}
