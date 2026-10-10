export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center gap-2">
            <img src="/logo-icon.png" alt="Unbound" className="w-10 h-10 rounded-xl object-cover" />
            <span className="font-display font-bold text-2xl text-gray-900">
              Un<span className="text-primary-600">bound</span>
            </span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}