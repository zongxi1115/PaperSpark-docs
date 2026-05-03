import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { Banner } from 'fumadocs-ui/components/banner';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      <Banner id="docs-notice" className="bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-b border-amber-200 dark:border-amber-800">
        目前文档正在建设中，文字由AI辅助理解生成并略作审计，暂作参考，敬请理解。可先前往{' '}
        <a href="https://paper.062679.xyz" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap">
          演示地址
        </a>{' '}
        直接在线体验。
      </Banner>
      <AISearch>
        <AISearchPanel />
        <AISearchTrigger
          position="float"
          className={cn(
            buttonVariants({
              variant: 'secondary',
              className: 'text-fd-muted-foreground rounded-2xl',
            }),
          )}
        >
          <MessageCircleIcon className="size-4.5" />
          Ask AI
        </AISearchTrigger>
      </AISearch>


      {children}
    </DocsLayout>
  );
}
