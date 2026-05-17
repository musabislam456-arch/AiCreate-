import { Link } from 'react-router-dom';
import { useAppStore } from '../../lib/store';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Sparkles, History, User } from 'lucide-react';

export function Navbar() {
  const { user } = useAppStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-2xl tracking-tighter">CreatorAI</span>
        </Link>

        <div className="flex items-center space-x-6">
          <button 
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/#core-tools';
              } else {
                document.getElementById('core-tools')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            Explore Tools
          </button>
          
          <button 
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/#advanced-tools';
              } else {
                document.getElementById('advanced-tools')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            Advanced Features
          </button>
          
          <Link to="/blog" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            Creator Blog
          </Link>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      {user.email && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link to="/history" className="cursor-pointer flex items-center w-full">
                  <DropdownMenuItem>
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/profile" className="cursor-pointer flex items-center w-full">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
