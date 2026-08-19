export const APP_TABS = ['today', 'memory', 'progress', 'you'] as const
export type AppTab = (typeof APP_TABS)[number]

export const TAB_META: Record<AppTab, { label: string; icon: string }> = {
  today: { label: 'Today', icon: '◉' },
  memory: { label: 'Memory', icon: '✦' },
  progress: { label: 'Progress', icon: '◇' },
  you: { label: 'You', icon: '◎' },
}
