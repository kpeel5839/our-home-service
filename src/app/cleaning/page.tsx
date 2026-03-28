"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_CLEANING_TASKS } from "@/lib/mock";
import { MOCK_MEMBERS, getMemberById } from "@/lib/mock/members";
import type { CleaningTask, CleaningFrequency } from "@/lib/types";

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
}

export default function CleaningPage() {
  const [tasks, setTasks] = useState<TaskState[]>(
    MOCK_CLEANING_TASKS.map((t) => ({ ...t, isCompleted: false }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMemberId, setNewMemberId] = useState(MOCK_MEMBERS[0].id);
  const [newFrequency, setNewFrequency] = useState<CleaningFrequency>("WEEKLY");

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        name: newName.trim(),
        frequency: newFrequency,
        assignedMemberId: newMemberId,
        isCompleted: false,
      },
    ]);
    setModalOpen(false);
    setNewName("");
    setNewMemberId(MOCK_MEMBERS[0].id);
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
                  <TaskRow key={task.id} task={task} onToggle={toggleComplete} />
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
                  <TaskRow key={task.id} task={task} onToggle={toggleComplete} />
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
              {MOCK_MEMBERS.map((m) => (
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
  onToggle,
}: {
  task: TaskState & { isCompleted: boolean };
  onToggle: (id: string) => void;
}) {
  const member = getMemberById(task.assignedMemberId);
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

