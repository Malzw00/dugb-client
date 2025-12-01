import { Table, TableBody, TableHeader, Toolbar } from "@fluentui/react-components";


/**
 * 
 * @param {{className, tableRows, tableHeaderCells, toolbarChildren, headerChildren}} props 
 * @returns 
 */
export default function AbstractContentArea(props) {

    const {className, tableRows, tableHeaderCells, toolbarChildren, headerChildren, footerChildren} = props

    return <div {...props} className={`content-area ${className?? ''}`}>
        
        <div className="ca-header">
            {headerChildren?? []}
        </div>

        <div className="tool-bar">
            {toolbarChildren?? []}
        </div>
        
        <div className="table-container">
            <Table className="table">
                
                <TableHeader className="table-header">
                    {tableHeaderCells?? []}
                </TableHeader>
                
                <TableBody className="table-body">
                    {tableRows?? []}
                </TableBody>
            </Table>
        </div>

        <div className="ca-footer">
            {footerChildren?? []}
        </div>
    
    </div>
}