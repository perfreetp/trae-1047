import type { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-gray-100 text-gray-600' },
  submitted: { label: '已提交', className: 'bg-blue-100 text-blue-600' },
  processing: { label: '办理中', className: 'bg-primary-100 text-primary-600' },
  correction: { label: '待补正', className: 'bg-warning-100 text-warning-600' },
  approved: { label: '已通过', className: 'bg-success-100 text-success-600' },
  rejected: { label: '已驳回', className: 'bg-danger-100 text-danger-600' },
  completed: { label: '已完成', className: 'bg-green-100 text-green-600' }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
