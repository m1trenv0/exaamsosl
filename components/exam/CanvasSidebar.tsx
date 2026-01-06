export default function CanvasSidebar() {
  return (
    <header className="ic-app-header" aria-label="Global Header">
      <div className="flex flex-col h-full">
        <div className="h-[65px] flex items-center justify-center p-3 mb-1">
          <div className="w-full text-center">
            <div className="text-black font-bold italic text-[26px] leading-none" style={{ fontFamily: 'Times New Roman, serif' }}>
              KdG
            </div>
            <div className="text-black/70 text-[8px] mt-0.5" style={{ fontFamily: 'sans-serif' }}>
              Karel de Grote
            </div>
          </div>
        </div>

        <ul className="flex-1 list-none p-0 m-0 flex flex-col w-full">
          <SidebarItem icon="account" label="Account" />
          <SidebarItem icon="dashboard" label="Dashboard" />
          <SidebarItem icon="courses" label="Courses" active />
          <SidebarItem icon="groups" label="Groups" />
          <SidebarItem icon="calendar" label="Calendar" />
          <SidebarItem icon="inbox" label="Inbox" />
          <SidebarItem icon="history" label="History" />
          <SidebarItem icon="help" label="Help" badge="10" />
        </ul>
      </div>
    </header>
  )
}

function SidebarItem({ 
  icon, 
  label, 
  active = false,
  badge 
}: { 
  icon: string
  label: string
  active?: boolean
  badge?: string
}) {
  return (
    <li className={`w-full ${active ? 'bg-white' : ''}`}>
      <a 
        href="#" 
        className={`flex flex-col items-center justify-center text-black no-underline py-2.5 w-full transition-colors hover:bg-black/5 ${active ? 'hover:bg-white' : ''}`}
      >
        <div className="w-7 h-7 mb-1 relative flex items-center justify-center">
          {icon === 'account' && (
            <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-300">
              <div className="w-full h-full bg-gray-200" />
            </div>
          )}
          {icon !== 'account' && (
            <svg className={`w-[26px] h-[26px] ${active ? 'fill-[#5dbca3]' : 'fill-black'}`} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
          {badge && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center">
              {badge}
            </span>
          )}
        </div>
        <div className={`text-[10px] font-normal leading-tight text-center ${active ? 'text-[#5dbca3]' : 'text-black'}`}>
          {label}
        </div>
      </a>
    </li>
  )
}
