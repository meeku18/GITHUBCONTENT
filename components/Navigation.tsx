'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Bell, 
  Share2,
  Activity,
  Trophy,
  Users,
  FileText,
  LogOut
} from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Journal', href: '/journal', icon: BookOpen },
    { name: 'Activities', href: '/activities', icon: Activity },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Share', href: '/share', icon: Share2 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            GitHub Journal
          </Link>
        </div>

        {/* User Info */}
        {session?.user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {session.user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex-1 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-md"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
} 