import { Alert } from '@/components/ui/feedback/Alert';
import { Loading } from '@/components/ui/loading/Loading';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/feedback/Toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/feedback/Tooltip';

export default function DemoPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">UI Components Demo</h1>

      {/* Loading Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading Components</h2>
        <div className="flex items-center space-x-4">
          <Loading size="sm" />
          <Loading size="md" />
          <Loading size="lg" />
          <Loading variant="skeleton" size="sm" />
          <Loading variant="skeleton" size="md" />
          <Loading variant="skeleton" size="lg" />
        </div>
      </section>

      {/* Alert Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Alert Components</h2>
        <div className="space-y-4">
          <Alert variant="default" title="Default Alert">
            This is a default alert message.
          </Alert>
          <Alert variant="success" title="Success Alert">
            This is a success alert message.
          </Alert>
          <Alert variant="warning" title="Warning Alert">
            This is a warning alert message.
          </Alert>
          <Alert variant="error" title="Error Alert">
            This is an error alert message.
          </Alert>
        </div>
      </section>

      {/* Toast Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Toast Components</h2>
        <ToastProvider>
          <div className="space-y-4">
            <Toast variant="default" title="Default Toast">
              This is a default toast message.
            </Toast>
            <Toast variant="success" title="Success Toast">
              This is a success toast message.
            </Toast>
            <Toast variant="warning" title="Warning Toast">
              This is a warning toast message.
            </Toast>
            <Toast variant="error" title="Error Toast">
              This is an error toast message.
            </Toast>
          </div>
          <ToastViewport />
        </ToastProvider>
      </section>

      {/* Tooltip Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tooltip Components</h2>
        <TooltipProvider>
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger className="px-4 py-2 bg-gray-100 rounded-md">
                Hover me
              </TooltipTrigger>
              <TooltipContent>
                This is a tooltip message
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </section>
    </div>
  );
} 