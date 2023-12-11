import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export const MobileMenu = () => {
  return (
    <Button variant="ghost" className="mr-2 md:hidden" size="icon">
      <Menu />
    </Button>
  )
}
