import { Link } from "react-router-dom";
import { Plus, Heart, MessageCircle } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_POSTS } from "@/lib/mock";
import { getMemberById } from "@/lib/mock/members";
import { formatDate } from "@/lib/utils/date";

export default function CommunityPage() {
  const sorted = [...MOCK_POSTS].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <>
      <TopHeader title="가족 피드" />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto pb-24 space-y-4">
        <div className="mb-2 hidden lg:block">
          <h1 className="text-2xl font-bold text-text-base">가족 피드</h1>
        </div>
        {sorted.map((post) => {
          const author = getMemberById(post.authorId);
          if (!author) return null;
          return (
            <Link key={post.id} to={`/community/${post.id}`} className="block">
              <Card className="p-0 overflow-hidden active:scale-[0.99] transition-transform">
                {/* 첫 번째 이미지 */}
                {post.images.length > 0 && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt="게시글 이미지"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  {/* 작성자 */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar member={author} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-text-base">{author.name}</p>
                      <p className="text-xs text-text-muted">
                        {formatDate(post.createdAt.slice(0, 10))}
                      </p>
                    </div>
                  </div>
                  {/* 내용 */}
                  <p className="text-sm text-text-base line-clamp-3">{post.content}</p>
                  {/* 좋아요 · 댓글 */}
                  <div className="flex items-center gap-4 mt-3 text-text-muted">
                    <span className="flex items-center gap-1 text-xs">
                      <Heart size={14} />
                      {post.likes.length}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <MessageCircle size={14} />
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* FAB */}
      <Link
        to="/community/new"
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
      >
        <Plus size={24} />
      </Link>
    </>
  );
}
