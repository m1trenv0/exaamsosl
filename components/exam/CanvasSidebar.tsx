'use client'

export default function CanvasSidebar() {
  return (
    <header id="header" className="ic-app-header no-print" aria-label="Global Header">
      <div role="region" className="ic-app-header__main-navigation flex flex-col h-full" aria-label="Global navigation">
        
        <div className="ic-app-header__logomark-container">
          <a href="https://canvas.kdg.be/" className="ic-app-header__logomark">
            <img src="/KdG-logo-V-zwart-rgb.png" alt="KdG Logo" />
          </a>
        </div>

        <ul id="menu" className="ic-app-header__menu-list">
          <li className="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_profile_link" role="button" href="/profile/settings" className="ic-app-header__menu-list-link">
              <div className="menu-item-icon-container">
                <div aria-hidden="true" className="fs-exclude ic-avatar">
                  <img src="https://canvas.kdg.be/images/messages/avatar-50.png" alt="Student" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              </div>
              <div className="menu-item__text">Account</div>
            </a>
          </li>

          <li className="ic-app-header__menu-list-item">
            <a id="global_nav_dashboard_link" href="https://canvas.kdg.be/" className="ic-app-header__menu-list-link">
              <div className="menu-item-icon-container" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="ic-icon-svg ic-icon-svg--dashboard" version="1.1" x="0" y="0" viewBox="0 0 280 200" enableBackground="new 0 0 280 200" xmlSpace="preserve"><path d="M273.09,180.75H197.47V164.47h62.62A122.16,122.16,0,1,0,17.85,142a124,124,0,0,0,2,22.51H90.18v16.29H6.89l-1.5-6.22A138.51,138.51,0,0,1,1.57,142C1.57,65.64,63.67,3.53,140,3.53S278.43,65.64,278.43,142a137.67,137.67,0,0,1-3.84,32.57ZM66.49,87.63,50.24,71.38,61.75,59.86,78,76.12Zm147,0L202,76.12l16.25-16.25,11.51,11.51ZM131.85,53.82v-23h16.29v23Zm15.63,142.3a31.71,31.71,0,0,1-28-16.81c-6.4-12.08-15.73-72.29-17.54-84.25a8.15,8.15,0,0,1,13.58-7.2c8.88,8.21,53.48,49.72,59.88,61.81a31.61,31.61,0,0,1-27.9,46.45ZM121.81,116.2c4.17,24.56,9.23,50.21,12,55.49A15.35,15.35,0,1,0,161,157.3C158.18,152,139.79,133.44,121.81,116.2Z"></path></svg>
              </div>
              <div className="menu-item__text">Dashboard</div>
            </a>
          </li>

          <li className="menu-item ic-app-header__menu-list-item ic-app-header__menu-list-item--active" aria-current="page">
            <a id="global_nav_courses_link" role="button" href="/courses" className="ic-app-header__menu-list-link">
              <div className="menu-item-icon-container" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="ic-icon-svg ic-icon-svg--courses" version="1.1" x="0" y="0" viewBox="0 0 280 259" enableBackground="new 0 0 280 259" xmlSpace="preserve"><path d="M73.31,198c-11.93,0-22.22,8-24,18.73a26.67,26.67,0,0,0-.3,3.63v.3a22,22,0,0,0,5.44,14.65,22.47,22.47,0,0,0,17.22,8H200V228.19h-134V213.08H200V198Zm21-105.74h90.64V62H94.3ZM79.19,107.34V46.92H200v60.42Zm7.55,30.21V122.45H192.49v15.11ZM71.65,16.71A22.72,22.72,0,0,0,49,39.36V190.88a41.12,41.12,0,0,1,24.32-8h157V16.71ZM33.88,39.36A37.78,37.78,0,0,1,71.65,1.6H245.36V198H215.15v45.32h22.66V258.4H71.65a37.85,37.85,0,0,1-37.76-37.76Z"></path></svg>
              </div>
              <div className="menu-item__text">Courses</div>
            </a>
          </li>

          <li className="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_groups_link" role="button" href="/groups" className="ic-app-header__menu-list-link">
              <div className="menu-item-icon-container" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="ic-icon-svg ic-icon-svg--groups" viewBox="0 0 200 135"><path d="M134.5 129.4c0-1.1 0-19.8-6.2-31.1-4.5-8.5-16.4-12.4-35-19.2-1.7-.6-3.4-1.1-5.1-1.7v-8.5c5.6-5.1 8.5-12.4 8.5-20.3V29.4C96.6 13 83.6 0 67.2 0S37.9 13 37.9 29.4v19.2c0 7.3 3.4 14.7 8.5 20.3v8.5c-1.7.6-3.4 1.1-5.1 1.7-18.6 6.2-30.5 10.7-35 19.2C0 109.6 0 128.8 0 129.4c0 3.4 2.3 5.6 5.6 5.6h123.7c3.5 0 5.7-2.3 5.2-5.6zm-123.2-5.7c.6-5.6 1.7-14.7 3.4-19.8C17 98.8 30 94.3 43.5 89.8c2.8-1.1 5.6-2.3 9-3.4 2.3-.6 4-2.8 4-5.1V66.7c0-1.7-.6-3.4-1.7-4.5-4-3.4-6.2-8.5-6.2-13.6V29.4c0-10.2 7.9-18.1 18.1-18.1s18.1 7.9 18.1 18.1v19.2c0 5.1-2.3 10.2-6.2 13.6-1.1 1.1-1.7 2.8-1.7 4.5v14.7c0 2.3 1.7 4.5 4 5.1 2.8 1.1 6.2 2.3 9 3.4 13.6 5.1 26.6 9.6 28.8 14.1 2.8 5.1 4 13.6 4.5 19.8H11.3zM196 79.1c-2.8-6.2-11.3-9.6-22.6-13.6l-1.7-.6v-3.4c4.5-4 6.8-9.6 6.8-15.8V35c0-12.4-9.6-22-22-22s-22 10.2-22 22v10.7c0 6.2 2.3 11.9 6.8 15.8V65l-1.7.6c-7.3 2.8-13 4.5-16.9 7.3-1.7 1.1-2.3 2.8-2.3 5.1.6 1.7 1.7 3.4 3.4 4.5 7.9 4 12.4 7.3 14.1 10.7 2.3 4.5 4 10.2 5.1 18.1.6 2.3 2.8 4.5 5.6 4.5h45.8c3.4 0 5.6-2.8 5.6-5.1 0-3.9 0-24.3-4-31.6zm-42.9 25.4c-1.1-6.8-2.8-12.4-5.1-16.9-1.7-4-5.1-6.8-9.6-10.2 1.7-1.1 3.4-1.7 5.1-2.3l5.6-2.3c1.7-.6 3.4-2.8 3.4-5.1v-9.6c0-1.7-.6-3.4-2.3-4.5-2.8-1.7-4.5-5.1-4.5-8.5V34.5c0-6.2 4.5-10.7 10.7-10.7s10.7 5.1 10.7 10.7v10.7c0 3.4-1.7 6.2-4.5 8.5-1.1 1.1-2.3 2.8-2.3 4.5v10.2c0 2.3 1.1 4.5 3.4 5.1l5.6 2.3c6.8 2.3 15.3 5.6 16.4 7.9 1.7 2.8 2.8 12.4 2.8 20.9h-35.4z"></path></svg>
              </div>
              <div className="menu-item__text">Groups</div>
            </a>
          </li>

          <li className="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_calendar_link" href="/calendar" className="ic-app-header__menu-list-link">
              <div className="menu-item-icon-container" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="ic-icon-svg ic-icon-svg--calendar" version="1.1" x="0" y="0" viewBox="0 0 280 280" enableBackground="new 0 0 280 280" xmlSpace="preserve"><path d="M197.07,213.38h16.31V197.07H197.07Zm-16.31,16.31V180.76h48.92v48.92Zm-48.92-16.31h16.31V197.07H131.85Zm-16.31,16.31V180.76h48.92v48.92ZM66.62,213.38H82.93V197.07H66.62ZM50.32,229.68V180.76H99.24v48.92Zm146.75-81.53h16.31V131.85H197.07Zm-16.31,16.31V115.54h48.92v48.92Zm-48.92-16.31h16.31V131.85H131.85Zm-16.31,16.31V115.54h48.92v48.92ZM66.62,148.15H82.93V131.85H66.62ZM50.32,164.46V115.54H99.24v48.92ZM34,262.29H246V82.93H34ZM246,66.62V42.16A8.17,8.17,0,0,0,237.84,34H213.38v8.15a8.15,8.15,0,1,1-16.31,0V34H82.93v8.15a8.15,8.15,0,0,1-16.31,0V34H42.16A8.17,8.17,0,0,0,34,42.16V66.62Zm-8.15-48.92a24.49,24.49,0,0,1,24.46,24.46V278.6H17.71V42.16A24.49,24.49,0,0,1,42.16,17.71H66.62V9.55a8.15,8.15,0,0,1,16.31,0v8.15H197.07V9.55a8.15,8.15,0,1,1,16.31,0v8.15Z"></path></svg>
              </div>
              <div className="menu-item__text">Calendar</div>
            </a>
          </li>

          <li className="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_conversations_link" href="/conversations" className="ic-app-header__menu-list-link">
              <div className="menu-item-icon-container">
                <span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" className="ic-icon-svg ic-icon-svg--inbox" version="1.1" x="0" y="0" viewBox="0 0 280 280" enableBackground="new 0 0 280 280" xmlSpace="preserve"><path d="M91.72,120.75h96.56V104.65H91.72Zm0,48.28h80.47V152.94H91.72Zm0-96.56h80.47V56.37H91.72Zm160.94,34.88H228.52V10.78h-177v96.56H27.34A24.17,24.17,0,0,0,3.2,131.48V244.14a24.17,24.17,0,0,0,24.14,24.14H252.66a24.17,24.17,0,0,0,24.14-24.14V131.48A24.17,24.17,0,0,0,252.66,107.34Zm0,16.09a8.06,8.06,0,0,1,8,8v51.77l-32.19,19.31V123.44ZM67.58,203.91v-177H212.42v177ZM27.34,123.44H51.48v79.13L19.29,183.26V131.48A8.06,8.06,0,0,1,27.34,123.44ZM252.66,252.19H27.34a8.06,8.06,0,0,1-8-8V202l30,18H230.75l30-18v42.12A8.06,8.06,0,0,1,252.66,252.19Z"></path></svg></span>
              </div>
              <div className="menu-item__text">Inbox</div>
            </a>
          </li>

          <li className="menu-item ic-app-header__menu-list-item">
            <a id="global_nav_history_link" role="button" href="#" className="ic-app-header__menu-list-link">
              <div className="menu-item-icon-container" aria-hidden="true">
                <svg viewBox="0 0 1920 1920" className="ic-icon-svg menu-item__icon svg-icon-history" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M960 112.941c-467.125 0-847.059 379.934-847.059 847.059 0 467.125 379.934 847.059 847.059 847.059 467.125 0 847.059-379.934 847.059-847.059 0-467.125-379.934-847.059-847.059-847.059M960 1920C430.645 1920 0 1489.355 0 960S430.645 0 960 0s960 430.645 960 960-430.645 960-960 960m417.905-575.955L903.552 988.28V395.34h112.941v536.47l429.177 321.77-67.765 90.465z" stroke="none" strokeWidth="1" fillRule="evenodd"></path>
                </svg>
              </div>
              <div className="menu-item__text">History</div>
            </a>
          </li>

          <li id="context_external_tool_753_menu_item" className="globalNavExternalTool menu-item ic-app-header__menu-list-item">
            <a className="ic-app-header__menu-list-link" href="/accounts/1/external_tools/753?launch_type=global_navigation" target="">
              <svg version="1.1" className="ic-icon-svg ic-icon-svg--lti menu-item__icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64">
                <path d="M13.49,26.92a2,2,0,0,1-2-2A13.51,13.51,0,0,1,25,11.47a2,2,0,1,1,0,3.9A9.6,9.6,0,0,0,15.44,25,2,2,0,0,1,13.49,26.92ZM62.21,62.15a6.11,6.11,0,0,1-8.64,0L41.28,49.85a26.72,26.72,0,0,1-13.61,4.05h-.75a26.93,26.93,0,1,1,0-53.86h.12A26.94,26.94,0,0,1,49.92,41.22l12.3,12.3A6.11,6.11,0,0,1,62.21,62.15ZM50,27A23,23,0,1,0,27,50h.61A23.06,23.06,0,0,0,50,27Zm9.49,29.29L47.52,44.33a27.17,27.17,0,0,1-3.11,3.13L56.34,59.39a2.21,2.21,0,0,0,3.12-3.12Z"></path>
              </svg>
              <div className="menu-item__text">Search</div>
            </a>
          </li>

          <li className="ic-app-header__menu-list-item">
            <a id="global_nav_help_link" role="button" className="ic-app-header__menu-list-link" data-track-category="help system" data-track-label="help button" href="https://help.instructure.com">
              <div className="menu-item-icon-container" role="presentation">
                <svg xmlns="http://www.w3.org/2000/svg" className="ic-icon-svg menu-item__icon svg-icon-help" version="1.1" x="0" y="0" viewBox="0 0 200 200" enableBackground="new 0 0 200 200" xmlSpace="preserve" fill="currentColor"><path d="M100,127.88A11.15,11.15,0,1,0,111.16,139,11.16,11.16,0,0,0,100,127.88Zm8.82-88.08a33.19,33.19,0,0,1,23.5,23.5,33.54,33.54,0,0,1-24,41.23,3.4,3.4,0,0,0-2.74,3.15v9.06H94.42v-9.06a14.57,14.57,0,0,1,11.13-14,22.43,22.43,0,0,0,13.66-10.27,22.73,22.73,0,0,0,2.31-17.37A21.92,21.92,0,0,0,106,50.59a22.67,22.67,0,0,0-19.68,3.88,22.18,22.18,0,0,0-8.65,17.64H66.54a33.25,33.25,0,0,1,13-26.47A33.72,33.72,0,0,1,108.82,39.8ZM100,5.2A94.8,94.8,0,1,0,194.8,100,94.91,94.91,0,0,0,100,5.2m0,178.45A83.65,83.65,0,1,1,183.65,100,83.73,83.73,0,0,1,100,183.65" transform="translate(-5.2 -5.2)"></path></svg>
                <span className="menu-item__badge"><span dir="ltr"><span style={{position: 'absolute', left: '-9999px'}}>10 unread release notes.</span><span aria-hidden="true">10</span></span></span>
              </div>
              <div className="menu-item__text">Help</div>
            </a>
          </li>
        </ul>
      </div>
      <div className="ic-app-header__secondary-navigation">
        <ul className="ic-app-header__menu-list">
          <li className="menu-item ic-app-header__menu-list-item">
            <a id="primaryNavToggle" role="button" href="#" className="ic-app-header__menu-list-link ic-app-header__menu-list-link--nav-toggle" aria-label="Minimise global navigation" title="Minimise global navigation">
              <div className="menu-item-icon-container" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="ic-icon-svg ic-icon-svg--navtoggle" version="1.1" x="0" y="0" width="40" height="32" viewBox="0 0 40 32" xmlSpace="preserve">
                  <path d="M39.5,30.28V2.48H37.18v27.8Zm-4.93-13.9L22.17,4,20.53,5.61l9.61,9.61H.5v2.31H30.14l-9.61,9.61,1.64,1.64Z"></path>
                </svg>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
