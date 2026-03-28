import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import type { CleaningTask, CleaningFrequency, CleaningAssignment, FamilyMember } from "@/lib/types";
import { todayYMD } from "@/lib/utils/date";

const FREQUENCY_LABELS: Record<CleaningFrequency, string> = {
  DAILY: "매일",
  WEEKLY: "매주",
  BIWEEKLY: "격주",
  MONTHLY: "매월",
};

const FREQUENCY_VARIANT: Record<CleaningFrequency, "default" | "success" | "warning" | "primary" | "danger"> = {
  DAILY: "danger",
  WEEKLY: "primary",
  BIWEEKLY: "warning",
  MONTHLY: "default",
};

interface TaskState extends CleaningTask {
  isCompleted: boolean;
  assignmentId?: string;
}

export default function CleaningPage() {
  const today = todayYMD();
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const [newFrequency, setNewFrequency] = useState<CleaningFrequency>("WEEKLY");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [tasksData, assignmentsData, membersData] = await Promise.all([
          api.get<CleaningTask[]>("/cleaning/tasks"),
          api.get<CleaningAssignment[]>(`/cleaning/assignments?date=${today}`),
          api.get<FamilyMember[]>("/members"),
        ]);
        setMembers(membersData);
        if (membersData.length > 0) setNewMemberId(membersData[0].id);
        const merged: TaskState[] = tasksData.map((task) => {
          const assignment = assignmentsData.find((a) => a.taskId === task.id);
          return {
            ...task,
            isCompleted: assignment?.isCompleted ?? false,
            assignmentId: assignment?.id,
          };
        });
        setTasks(merged);
      } catch (e) {
        setError(e instanceof Error ? e.message : "오류가 발생했어요");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <EmptyState icon="⚠️" message="데이터를 불러오지 못했어요" sub={error} />
  );

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task?.assignmentId) return;
    try {
      const updated = await api.patch<CleaningAssignment>(`/cleaning/assignments/${task.assignmentId}/complete`);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: updated.isCompleted } : t))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했어요");
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const created = await api.post<CleaningTask>("/cleaning/tasks", {
        name: newName.trim(),
        frequency: newFrequency,
        assignedMemberId: newMemberId,
      });
      setTasks((prev) => [...prev, { ...created, isCompleted: false }]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "오류가 발생했어요");
    }
    setModalOpen(false);
    setNewName("");
    setNewMemberId(members[0]?.id ?? "");
    setNewFrequency("WEEKLY");
  };

  const pending = tasks.filter((t) => !t.isCompleted);
  const completed = tasks.filter((t) => t.isCompleted);

  return (
    <>
      <TopHeader
        title="청소 담당"
        showBack
        right={
          <button
            onClick={() => setModalOpen(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-primary"
          >
            <Plus size={22} />
          </button>
        }
      />
      <div className="px-4 py-5 max-w-2xl tablet:max-w-3xl mx-auto space-y-4">
        <div className="hidden lg:flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-base">청소 담당</h1>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            항목 추가
          </Button>
        </div>

        {/* 진행 중 */}
        <section>
          <h2 className="text-sm font-semibold text-text-muted mb-2">
            진행 중 ({pending.length})
          </h2>
          <Card className="p-0 overflow-hidden">
            {pending.length === 0 ? (
              <EmptyState icon="✨" message="모든 청소를 완료했어요!" />
            ) : (
              <div className="divide-y divide-gray-50">
                {pending.map((task) => (
                  <TaskRow key={task.id} task={task} members={members} onToggle={toggleComplete} />
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* 완료 */}
        {completed.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-text-muted mb-2">
              완료 ({completed.length})
            </h2>
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {completed.map((task) => (
                  <TaskRow key={task.id} task={task} members={members} onToggle={toggleComplete} />
                ))}
              </div>
            </Card>
          </section>
        )}
      </div>

      {/* 항목 추가 Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="청소 항목 추가">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">
              청소 이름 <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="예: 주방 청소"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">담당자</label>
            <select
              value={newMemberId}
              onChange={(e) => setNewMemberId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-base mb-1.5">주기</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(FREQUENCY_LABELS) as CleaningFrequency[]).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setNewFrequency(freq)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-colors min-h-[44px] ${
                    newFrequency === freq
                      ? "bg-primary text-white border-primary"
                      : "border-gray-200 text-text-base"
                  }`}
                >
                  {FREQUENCY_LABELS[freq]}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleAdd} disabled={!newName.trim()} className="w-full">
            추가하기
          </Button>
        </div>
      </Modal>
    </>
  );
}

function TaskRow({
  task,
  members,
  onToggle,
}: {
  task: TaskState & { isCompleted: boolean };
  members: FamilyMember[];
  onToggle: (id: string) => void;
}) {
  const member = members.find((m) => m.id === task.assignedMemberId);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        onClick={() => onToggle(task.id)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
      >
        {task.isCompleted ? (
          <CheckCircle2 size={24} className="text-green-500" />
        ) : (
          <Circle size={24} className="text-gray-300" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm ${task.isCompleted ? "line-through text-text-muted" : "text-text-base"}`}>
          {task.name}
        </p>
        <Badge variant={FREQUENCY_VARIANT[task.frequency]} className="mt-1">
          {FREQUENCY_LABELS[task.frequency]}
        </Badge>
      </div>
      {member && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Avatar member={member} size="sm" />
          <span className="text-sm text-text-base">{member.name}</span>
        </div>
      )}
    </div>
  );
}
