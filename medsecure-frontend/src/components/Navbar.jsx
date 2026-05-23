import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

function Navbar() {
  const { user, Logout } = useAuth()
  const navigate = useNavigate()

  const roleRoutes = {
    PATIENT: '/dashboard',
    DOCTOR: '/doctor',
    ADMIN: '/admin',
  }

  const roleColors = {
    PATIENT: 'bg-blue-100 text-blue-700',
    DOCTOR: 'bg-green-100 text-green-700',
    ADMIN: 'bg-red-100 text-red-700',
  }

  const getInitials = (username) => {
    if (!username) return 'U'
    return username.slice(0, 2).toUpperCase()
  }

  const handleLogout = () => {
    Logout()
    navigate('/')
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white px-6 py-3 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-gray-900">
          Med<span className="text-emerald-600">Secure</span>
        </span>
      </div>

      {/* Role switcher — only shows if user has multiple roles */}
      <div className="flex items-center gap-2">
        {user?.roles && Array.from(user.roles).map(role => (
          <button
            key={role}
            onClick={() => navigate(roleRoutes[role])}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${roleColors[role]}`}
          >
            {role.charAt(0) + role.slice(1).toLowerCase()} view
          </button>
        ))}
      </div>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm">
                {getInitials(user?.username)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700 hidden sm:block">
              {user?.username}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs text-gray-500">
            Signed in as
          </DropdownMenuLabel>
          <DropdownMenuLabel className="text-sm font-medium -mt-1">
            {user?.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600 focus:text-red-600"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </nav>
  )
}

export default Navbar