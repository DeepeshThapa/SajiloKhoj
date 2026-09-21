import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied (403)</h1>
        <p className="text-slate-500 text-sm mb-6">
          You do not have the required administrative or role permissions to view this secure section of Sajilo Khoj.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4" /> Go to Homepage
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="primary" className="w-full">
              Switch Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
