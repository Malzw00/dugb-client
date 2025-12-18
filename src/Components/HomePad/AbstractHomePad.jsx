import { TabList } from "@fluentui/react-components";

/**
 * AbstractHomePad Component
 * 
 * A reusable layout component that provides a sidebar with tabs and a content area.
 * This component follows a two-column layout pattern commonly used in dashboard interfaces.
 * 
 * @component
 * @example
 * // Basic usage
 * <AbstractHomePad
 *   sideBar={{
 *     title: "Navigation",
 *     tabs: <TabList><Tab>Tab 1</Tab></TabList>
 *   }}
 *   contentArea={<div>Main Content</div>}
 * />
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.sideBar - Sidebar configuration object
 * @param {string} [props.sideBar.title] - Optional title displayed in the sidebar header
 * @param {React.ReactNode} [props.sideBar.headerNode]
 * @param {React.ReactNode} [props.sideBar.tabs] - Tab elements to render in the sidebar
 * @param {React.ReactNode} [props.sideBar.selectedValue]
 * @param {React.ReactNode} [props.sideBar.onTabSelect]
 * @param {React.ReactNode} [props.contentArea] - Optional content to display in the main area
 * 
 * @returns {React.ReactElement} A two-column layout with sidebar and content area
 * 
 * @remarks
 * - The component uses CSS classes: 'home-pad', 'sidebar', 'sidebar-header', 'sidebar-tablist'
 * - The sidebar tablist uses Fluent UI's TabList component
 * - Content area is optional and won't render if not provided
 * - Sidebar title is optional and defaults to empty string if not provided
 */
export default function AbstractHomePad({ sideBar, contentArea }) {
    return (
        <div className="home-pad">
            
            <div className="sidebar">
                
                <div className="sidebar-header">
                    <h2 className="sidebar-header-title">
                        {sideBar.title || ""}
                    </h2>
                    {sideBar.headerNode || null}
                </div>
                
                <TabList 
                    vertical
                    className="sidebar-tablist" 
                    selectedValue={sideBar.selectedValue ?? 0} 
                    onTabSelect={sideBar.onTabSelect}>
                        
                    {sideBar.tabs}
                </TabList>
            
            </div>
            
            {contentArea || null}
        </div>
    );
}