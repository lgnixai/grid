import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GuideOverlayProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function GuideOverlay({ open, onClose, className }: GuideOverlayProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center bg-black/40 visual-grid-fade-in',
        className
      )}
      role="dialog"
      aria-modal="true"
      data-testid="guide-overlay"
      onClick={onClose}
    >
      <div
        className="w-[960px] max-w-[95vw] rounded-lg bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">操作指南</h2>
          <Button size="sm" variant="outline" onClick={onClose} data-testid="guide-close">
            关闭
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 text-sm">
          {/* 鼠标操作 */}
          <div>
            <div className="mb-2 text-base font-medium">鼠标操作</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>左键点击：选择单元格</li>
              <li>Ctrl+点击：多选单元格</li>
              <li>Shift+点击：范围选择</li>
              <li>双击：编辑单元格</li>
              <li>右键：显示上下文菜单</li>
            </ul>
          </div>
          {/* 列操作 */}
          <div>
            <div className="mb-2 text-base font-medium">列操作</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>拖拽列边缘：调整列宽</li>
              <li>拖拽列标题：重排列顺序</li>
              <li>右键列标题：打开列菜单</li>
              <li>点击分组：展开/折叠</li>
              <li>菜单：固定、隐藏等</li>
            </ul>
          </div>
          {/* 键盘操作 */}
          <div>
            <div className="mb-2 text-base font-medium">键盘操作</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>方向键：移动选择</li>
              <li>Enter：编辑单元格</li>
              <li>Escape：取消操作</li>
              <li>Ctrl+C：复制</li>
              <li>Delete：清除内容</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideOverlay;

